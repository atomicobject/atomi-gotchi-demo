import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const createPet = mutation({
  args: {
    petName: v.string(),
    email: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.boolean(),
      petId: v.optional(v.id("pets")),
      error: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const petId = await ctx.db.insert("pets", {
        name: args.petName,
        health: 100,
        hunger: 100,
        userId: user._id,
        mood: "happy",
      });

      return {
        success: true,
        petId: petId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create pet",
      };
    }
  },
});
