import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { analytics } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Dashboard API endpoint (from task description)
const DASHBOARD_API_URL = process.env.DASHBOARD_API_URL || "https://6000-xxjchzjnuwtphiqhjcgbt-9f2f415c.us1.manus.computer/api/events";

/**
 * Event types that can be sent to Dashboard
 */
const EventType = z.enum(["SESSION_START", "MESSAGE_SENT", "RISK_DETECTED", "SESSION_END"]);

/**
 * Risk levels for RISK_DETECTED events
 */
const RiskLevel = z.enum(["low", "medium", "high", "critical"]);

/**
 * Risk types for RISK_DETECTED events
 */
const RiskType = z.enum(["suicidality", "self_harm", "abuse", "other"]);

/**
 * Send event to Dashboard API
 */
async function sendEventToDashboard(eventType: string, eventData: any) {
  try {
    const response = await fetch(DASHBOARD_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_type: "matti",
        event_type: eventType,
        timestamp: new Date().toISOString(),
        ...eventData,
      }),
    });

    if (!response.ok) {
      console.error(`[Analytics] Dashboard API error: ${response.status} ${response.statusText}`);
      return false;
    }

    console.log(`[Analytics] Event sent to Dashboard: ${eventType}`);
    return true;
  } catch (error) {
    console.error(`[Analytics] Failed to send event to Dashboard:`, error);
    return false;
  }
}

export const analyticsRouter = router({
  /**
   * Track SESSION_START event
   * Triggered when user starts a new chat session
   */
  trackSessionStart: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        themeId: z.string(),
        isNewUser: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { conversationId, themeId, isNewUser } = input;

      // Calculate age group from age
      let ageGroup = "12-21";
      if (user.age) {
        if (user.age >= 12 && user.age <= 13) ageGroup = "12-13";
        else if (user.age >= 14 && user.age <= 15) ageGroup = "14-15";
        else if (user.age >= 16 && user.age <= 17) ageGroup = "16-17";
        else if (user.age >= 18 && user.age <= 21) ageGroup = "18-21";
      }

      // Extract gemeente from postal code (first 4 digits)
      const gemeente = user.postalCode ? user.postalCode.substring(0, 4) : null;

      const eventData = {
        userId: user.id,
        sessionId: conversationId,
        leeftijd: user.age,
        leeftijdsgroep: ageGroup,
        gemeente,
        is_new_user: isNewUser,
        theme: themeId,
      };

      // Send to Dashboard
      await sendEventToDashboard("SESSION_START", eventData);

      // Store in local analytics table
      try {
        const db = await getDb();
        if (!db) return { success: true };
        await db.insert(analytics).values({
          userId: user.id,
          conversationId,
          themeId: themeId as any,
          messageCount: 0,
          durationMinutes: 0,
          rewardsEarned: 0,
        });
      } catch (error) {
        console.error("[Analytics] Failed to insert session start:", error);
      }

      return { success: true };
    }),

  /**
   * Track MESSAGE_SENT event
   * Triggered every time user sends a message
   */
  trackMessageSent: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        themeId: z.string(),
        messageCount: z.number(),
        sentiment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { conversationId, themeId, messageCount, sentiment } = input;

      const eventData = {
        userId: user.id,
        sessionId: conversationId,
        theme: themeId,
        messageCount,
        sentiment,
      };

      // Send to Dashboard
      await sendEventToDashboard("MESSAGE_SENT", eventData);

      // Update message count in analytics table
      try {
        const db = await getDb();
        if (!db) return { success: true };
        const existing = await db
          .select()
          .from(analytics)
          .where(
            and(
              eq(analytics.userId, user.id),
              eq(analytics.conversationId, conversationId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(analytics)
            .set({ messageCount })
            .where(eq(analytics.id, existing[0].id));
        }
      } catch (error) {
        console.error("[Analytics] Failed to update message count:", error);
      }

      return { success: true };
    }),

  /**
   * Track RISK_DETECTED event
   * Triggered when AI detects crisis signals
   */
  trackRiskDetected: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        riskLevel: RiskLevel,
        riskType: RiskType,
        actionTaken: z.string(),
        detectedText: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { conversationId, riskLevel, riskType, actionTaken, detectedText } = input;

      const eventData = {
        userId: user.id,
        sessionId: conversationId,
        riskLevel,
        riskType,
        action_taken: actionTaken,
        detected_text: detectedText,
      };

      // Send to Dashboard
      await sendEventToDashboard("RISK_DETECTED", eventData);

      console.log(`[Analytics] RISK_DETECTED: ${riskLevel} - ${riskType} for user ${user.id}`);

      return { success: true };
    }),

  /**
   * Track SESSION_END event
   * Triggered when user closes chat or session times out
   */
  trackSessionEnd: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        durationSeconds: z.number(),
        totalMessages: z.number(),
        satisfactionScore: z.number().min(1).max(5).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { conversationId, durationSeconds, totalMessages, satisfactionScore } = input;

      const eventData = {
        userId: user.id,
        sessionId: conversationId,
        duration_seconds: durationSeconds,
        total_messages: totalMessages,
        satisfaction_score: satisfactionScore,
      };

      // Send to Dashboard
      await sendEventToDashboard("SESSION_END", eventData);

      // Update analytics table with final stats
      try {
        const db = await getDb();
        if (!db) return { success: true };
        const existing = await db
          .select()
          .from(analytics)
          .where(
            and(
              eq(analytics.userId, user.id),
              eq(analytics.conversationId, conversationId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(analytics)
            .set({
              messageCount: totalMessages,
              durationMinutes: Math.floor(durationSeconds / 60),
            })
            .where(eq(analytics.id, existing[0].id));
        }
      } catch (error) {
        console.error("[Analytics] Failed to update session end:", error);
      }

      return { success: true };
    }),
});
