import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define all tables first
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // deposit, withdrawal, bonus, adjustment
  status: text("status").notNull(), // completed, pending, failed
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const emailNotifications = pgTable("email_notifications", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  recipientType: text("recipient_type").notNull(), // all, active, inactive, custom
  recipientIds: text("recipient_ids"),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  openRate: integer("open_rate"),
});

// Then define relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  emailNotifications: many(emailNotifications)
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id]
  })
}));

export const emailNotificationsRelations = relations(emailNotifications, ({ many }) => ({
  users: many(users)
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  balance: true,
  status: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertEmailNotificationSchema = createInsertSchema(emailNotifications).omit({
  id: true,
  sentAt: true,
  openRate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertEmailNotification = z.infer<typeof insertEmailNotificationSchema>;
