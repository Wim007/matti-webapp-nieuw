import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Matti-specific fields for youth profiles.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Matti-specific fields
  age: int("age"),
  birthYear: int("birthYear"),
  birthdate: varchar("birthdate", { length: 10 }), // ISO date YYYY-MM-DD
  ageGroup: mysqlEnum("ageGroup", ["12-13", "14-15", "16-17", "18-21"]),
  postalCode: varchar("postalCode", { length: 10 }),
  gender: mysqlEnum("gender", ["boy", "girl", "other", "prefer_not_to_say", "none"]).default("none"),
  analyticsConsent: boolean("analyticsConsent").default(false).notNull(),
  themeSuggestionsEnabled: boolean("themeSuggestionsEnabled").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Themes table - tracks current theme selection per user
 */
export const themes = mysqlTable("themes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  currentTheme: mysqlEnum("currentTheme", [
    "general",
    "school",
    "friends",
    "home",
    "feelings",
    "love",
    "freetime",
    "future",
    "self"
  ]).default("general").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Conversations table - stores chat conversations per theme
 * Each theme has its own conversation history
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  themeId: mysqlEnum("themeId", [
    "general",
    "school",
    "friends",
    "home",
    "feelings",
    "love",
    "freetime",
    "future",
    "self"
  ]).notNull(),
  threadId: varchar("threadId", { length: 255 }), // OpenAI thread ID
  summary: text("summary"), // Conversation summary for context
  messages: json("messages").$type<Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>>().notNull(), // Full message history as JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Actions table - tracks detected actions and follow-ups
 */
export const actions = mysqlTable("actions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  themeId: mysqlEnum("themeId", [
    "general",
    "school",
    "friends",
    "home",
    "feelings",
    "love",
    "freetime",
    "future",
    "self"
  ]).notNull(),
  conversationId: int("conversationId"),
  actionText: text("actionText").notNull(), // Description of the action
  actionType: varchar("actionType", { length: 100 }), // Type of action detected
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  followUpScheduled: timestamp("followUpScheduled"), // When follow-up is scheduled
  followUpIntervals: json("followUpIntervals").$type<number[]>(), // Array of intervals in days [2, 4, 7, 10, 14, 21]
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Sessions table - tracks user sessions for timeout logic
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lastActive: timestamp("lastActive").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Analytics table - tracks conversation metrics for dashboard reporting
 */
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  themeId: mysqlEnum("themeId", [
    "general",
    "school",
    "friends",
    "home",
    "feelings",
    "love",
    "freetime",
    "future",
    "self"
  ]),
  conversationId: int("conversationId"),
  threadId: varchar("threadId", { length: 255 }),
  initialProblem: text("initialProblem"), // Starting issue/topic
  messageCount: int("messageCount").default(0),
  durationMinutes: int("durationMinutes").default(0),
  outcome: text("outcome"), // Final resolution or status
  rewardsEarned: int("rewardsEarned").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Follow-ups table - scheduled check-ins for actions
 * Implements intelligent intervals (Day 2, 4, 7, 10, 14, 21)
 */
export const followUps = mysqlTable("followUps", {
  id: int("id").autoincrement().primaryKey(),
  actionId: int("actionId").notNull().references(() => actions.id),
  scheduledFor: timestamp("scheduledFor").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "responded", "skipped"]).default("pending").notNull(),
  notificationSent: timestamp("notificationSent"),
  response: text("response"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Theme = typeof themes.$inferSelect;
export type InsertTheme = typeof themes.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;
export type Action = typeof actions.$inferSelect;
export type InsertAction = typeof actions.$inferInsert;
export type FollowUp = typeof followUps.$inferSelect;
export type InsertFollowUp = typeof followUps.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;
