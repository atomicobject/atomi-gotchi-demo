import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

// Internal query to get pet by userId
export const getPetByUserId = internalQuery({
  args: {
    userId: v.id("users"),
  },
  returns: v.union(
    v.object({
      _id: v.id("pets"),
      _creationTime: v.number(),
      userId: v.id("users"),
      name: v.string(),
      health: v.number(),
      hunger: v.number(),
      mood: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const pet = await ctx.db
      .query("pets")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    return pet;
  },
});
