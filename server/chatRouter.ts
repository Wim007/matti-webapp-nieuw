import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { conversations } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import type { ThemeId } from "@shared/matti-types";

/**
 * Chat Router
 * 
 * Manages conversations, messages, and thread persistence
 */

const themeIdEnum = z.enum([
  "general",
  "school",
  "friends",
  "home",
  "feelings",
  "love",
  "freetime",
  "future",
  "self"
]);

export const chatRouter = router({
  /**
   * Get or create conversation for a theme
   */
  getConversation: protectedProcedure
    .input(z.object({
      themeId: themeIdEnum,
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const userId = ctx.user.id;
      const { themeId } = input;

      // Find existing conversation
      const existing = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.userId, userId),
            eq(conversations.themeId, themeId as ThemeId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return existing[0];
      }

      // Create new conversation
      await db.insert(conversations).values({
        userId,
        themeId: themeId as ThemeId,
        messages: [],
      });

      // Fetch the newly created conversation
      const newConversation = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.userId, userId),
            eq(conversations.themeId, themeId as ThemeId)
          )
        )
        .orderBy(conversations.createdAt)
        .limit(1);

      return newConversation[0];
    }),

  /**
   * Save message to conversation
   */
  saveMessage: protectedProcedure
    .input(z.object({
      themeId: themeIdEnum,
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      threadId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const userId = ctx.user.id;
      const { themeId, role, content, threadId } = input;

      // Get existing conversation
      const existing = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.userId, userId),
            eq(conversations.themeId, themeId as ThemeId)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        throw new Error("Conversation not found");
      }

      const conversation = existing[0];
      const newMessage = {
        role,
        content,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [
        ...(conversation.messages as Array<{ role: "user" | "assistant"; content: string; timestamp: string }>),
        newMessage,
      ];

      // Update conversation with new message and threadId
      const updateData: {
        messages: typeof updatedMessages;
        threadId?: string;
        updatedAt: Date;
      } = {
        messages: updatedMessages,
        updatedAt: new Date(),
      };

      if (threadId) {
        updateData.threadId = threadId;
      }

      await db
        .update(conversations)
        .set(updateData)
        .where(eq(conversations.id, conversation.id));

      return {
        success: true,
        messageCount: updatedMessages.length,
      };
    }),

  /**
   * Update conversation summary
   */
  updateSummary: protectedProcedure
    .input(z.object({
      themeId: themeIdEnum,
      summary: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const userId = ctx.user.id;
      const { themeId, summary } = input;

      await db
        .update(conversations)
        .set({
          summary,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(conversations.userId, userId),
            eq(conversations.themeId, themeId as ThemeId)
          )
        );

      return { success: true };
    }),
});

export type ChatRouter = typeof chatRouter;
