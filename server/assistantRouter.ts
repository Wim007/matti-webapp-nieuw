import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import OpenAI from "openai";

/**
 * OpenAI Assistant Router
 * 
 * Ported from original Matti mobile app
 * Integrates with trained OpenAI Assistant
 */

const openai = new OpenAI({
  apiKey: ENV.openaiApiKey,
});

// Request schema
const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  threadId: z.string().optional(),
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
  threadId: z.string(),
  error: z.string().optional(),
});

// Summarize request schema
const summarizeRequestSchema = z.object({
  threadId: z.string(),
  prompt: z.string(),
});

// Summarize response schema
const summarizeResponseSchema = z.object({
  summary: z.string(),
  error: z.string().optional(),
});

export const assistantRouter = router({
  /**
   * Send a message to the assistant
   */
  send: publicProcedure
    .input(chatRequestSchema)
    .output(chatResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const { message, threadId, context, themeId, userProfile } = input;

        // Create or use existing thread
        let thread;
        if (threadId) {
          thread = { id: threadId };
          console.log('[Assistant] Using existing thread:', threadId);
        } else {
          thread = await openai.beta.threads.create();
          console.log('[Assistant] Created new thread:', thread.id);
        }

        // Build user context for empathymap
        let userContext = '';
        if (userProfile) {
          const ageGroup = userProfile.age <= 13 ? '12-13' : 
                          userProfile.age <= 15 ? '14-15' :
                          userProfile.age <= 17 ? '16-17' : '18-21';
          const genderLabel = userProfile.gender === 'boy' ? 'Jongen' :
                             userProfile.gender === 'girl' ? 'Meisje' :
                             userProfile.gender === 'other' ? 'Anders' : 'Niet opgegeven';
          
          userContext = `[GEBRUIKER CONTEXT - BELANGRIJK VOOR EMPATHYMAP]\nNaam: ${userProfile.name}\nLeeftijd: ${userProfile.age} jaar (${ageGroup})\nGender: ${genderLabel}${themeId ? `\nHuidig thema: ${themeId}` : ''}\n\n`;
        }

        // Add context + user context + user message to thread
        const fullMessage = userContext + (context 
          ? `${context}\n\n---\n\nGebruiker: ${message}`
          : message);

        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: fullMessage,
        });

        console.log('[Assistant] Added message to thread');

        // Run the assistant
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
          assistant_id: ENV.openaiAssistantId,
        });

        console.log('[Assistant] Run completed:', run.status);

        if (run.status !== 'completed') {
          throw new Error(`Run failed with status: ${run.status}`);
        }

        // Get assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];

        if (!lastMessage || lastMessage.role !== 'assistant') {
          throw new Error('No assistant response found');
        }

        // Extract text content
        const textContent = lastMessage.content.find(c => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
          throw new Error('No text content in response');
        }

        const reply = textContent.text.value;

        console.log('[Assistant] Response received:', reply.substring(0, 100) + '...');

        return {
          reply,
          threadId: thread.id,
        };
      } catch (error) {
        console.error('[Assistant] Error:', error);
        
        return {
          reply: 'Sorry, er ging iets mis. Probeer het nog eens! 🔄',
          threadId: input.threadId || 'error',
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
        const { threadId, prompt } = input;

        console.log('[Assistant] Generating summary for thread:', threadId);

        // Use OpenAI Chat Completions for summarization (cheaper than assistant)
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Cheaper model for summaries
          messages: [
            {
              role: "system",
              content: "Je bent een behulpzame assistent die gesprekken samenvat in het Nederlands. Maak korte, bondige samenvattingen die de belangrijkste punten en gevoelens bevatten."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.5,
        });

        const summary = completion.choices[0]?.message?.content || '';

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
      assistantId: ENV.openaiAssistantId,
      hasApiKey: !!ENV.openaiApiKey,
    };
  }),
});

export type AssistantRouter = typeof assistantRouter;
