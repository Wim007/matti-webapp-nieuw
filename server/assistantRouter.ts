import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { detectRisk, detectCrisisResponse } from "@shared/risk-detection";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * OpenAI Chat Completions Router
 * 
 * Direct API implementation (bypassing SDK) for compatibility with project-scoped keys
 * Uses Chat Completions API instead of deprecated Assistants API
 */

// Load Matti instructions from file
const MATTI_INSTRUCTIONS = readFileSync(
  join(__dirname, '..', 'matti-instructions.md'),
  'utf-8'
);

// Request schema
const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.string().optional(), // Summary + recent messages
  themeId: z.string().optional(), // Theme ID for context
  userProfile: z.object({
    name: z.string(),
    age: z.number(),
    gender: z.enum(['boy', 'girl', 'other', 'prefer_not_to_say']),
  }).optional(), // User context for empathymap
});

// Response schema
const chatResponseSchema = z.object({
  reply: z.string(),
  error: z.string().optional(),
  riskDetected: z.boolean().optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  riskType: z.enum(['suicidality', 'self_harm', 'abuse', 'other']).optional(),
});

// Summarize request schema
const summarizeRequestSchema = z.object({
  prompt: z.string(),
});

// Summarize response schema
const summarizeResponseSchema = z.object({
  summary: z.string(),
  error: z.string().optional(),
});

/**
 * Call OpenAI Chat Completions API directly
 */
async function callOpenAI(messages: Array<{ role: string; content: string }>, model = "gpt-4o", temperature = 0.8) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.openaiApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export const assistantRouter = router({
  /**
   * Send a message to Matti using Chat Completions API
   */
  send: publicProcedure
    .input(chatRequestSchema)
    .output(chatResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const { message, context, themeId, userProfile } = input;

        // Build user context for empathymap
        let userContext = '';
        if (userProfile) {
          const ageGroup = userProfile.age <= 13 ? '12-13' : 
                          userProfile.age <= 15 ? '14-15' :
                          userProfile.age <= 17 ? '16-17' : '18-21';
          const genderLabel = userProfile.gender === 'boy' ? 'Jongen' :
                             userProfile.gender === 'girl' ? 'Meisje' :
                             userProfile.gender === 'other' ? 'Anders' : 'Niet opgegeven';
          
          userContext = `\n\n[GEBRUIKER CONTEXT - BELANGRIJK VOOR EMPATHYMAP]\nNaam: ${userProfile.name}\nLeeftijd: ${userProfile.age} jaar (${ageGroup})\nGender: ${genderLabel}${themeId ? `\nHuidig thema: ${themeId}` : ''}`;
        }

        // Build system message with Matti instructions + user context
        const systemMessage = MATTI_INSTRUCTIONS + userContext;

        // Build messages array
        const messages: Array<{ role: string; content: string }> = [
          { role: 'system', content: systemMessage }
        ];

        // Add context if provided (summary + recent messages)
        if (context) {
          messages.push({
            role: 'user',
            content: `[GESPREKSGESCHIEDENIS]\n${context}\n\n---\n\n[NIEUW BERICHT]`
          });
        }

        // Add current user message
        messages.push({
          role: 'user',
          content: message
        });

        console.log('[Assistant] Sending message to OpenAI Chat Completions API');
        console.log('[Assistant] Messages count:', messages.length);

        // Call OpenAI API directly
        const reply = await callOpenAI(messages);

        console.log('[Assistant] Response received:', reply.substring(0, 100) + '...');
        
        // Check for risk in AI response
        const riskDetection = detectRisk(reply);
        const isCrisisResponse = detectCrisisResponse(reply);
        
        // Return risk detection info for frontend to track
        return {
          reply,
          riskDetected: riskDetection?.detected || isCrisisResponse,
          riskLevel: riskDetection?.level,
          riskType: riskDetection?.type,
        };
      } catch (error) {
        console.error('[Assistant] Error:', error);
        
        return {
          reply: 'Sorry, er ging iets mis. Probeer het nog eens! 🔄',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Generate a summary of conversation
   */
  summarize: publicProcedure
    .input(summarizeRequestSchema)
    .output(summarizeResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const { prompt } = input;

        console.log('[Assistant] Generating summary');

        // Use cheaper model for summaries
        const summary = await callOpenAI(
          [
            {
              role: "system",
              content: "Je bent een behulpzame assistent die gesprekken samenvat in het Nederlands. Maak korte, bondige samenvattingen die de belangrijkste punten en gevoelens bevatten."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          "gpt-4o-mini",
          0.5
        );

        console.log('[Assistant] Summary generated:', summary.substring(0, 100) + '...');

        return {
          summary,
        };
      } catch (error) {
        console.error('[Assistant] Summarization error:', error);
        
        return {
          summary: '',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * Health check
   */
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      hasApiKey: !!ENV.openaiApiKey,
      apiType: 'chat-completions', // Direct API calls
    };
  }),
});

export type AssistantRouter = typeof assistantRouter;
