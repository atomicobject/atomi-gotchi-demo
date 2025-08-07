import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.boolean(),
      userId: v.optional(v.id("users")),
      error: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    try {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existing) {
        return {
          success: false,
          error: "A user with that email already exists",
        };
      }

      const userId = await ctx.db.insert("users", {
        email: args.email,
        password: args.password,
        emailEnabled: true,
      });

      return {
        success: true,
        userId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
