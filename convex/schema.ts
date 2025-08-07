import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(),
    emailEnabled: v.optional(v.boolean()),
  }).index("by_email", ["email"]),

  pets: defineTable({
    userId: v.id("users"),
    name: v.string(),
    health: v.number(),
    hunger: v.number(),
    mood: v.string(),
  }).index("by_userId", ["userId"]),
});
