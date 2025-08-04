import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const getPet = mutation({
  args: {
    email: v.string(),
  },
  returns: v.object({
    pet: v.optional(
      v.object({
        id: v.id("pets"),
        name: v.string(),
        health: v.number(),
        hunger: v.number(),
        mood: v.string(),
        nextEmailAt: v.optional(v.string())
      })
    ),
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
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

      const existingPet = await ctx.db
        .query("pets")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();

      return {
        pet: existingPet
          ? {
              id: existingPet._id,
              name: existingPet.name,
              health: existingPet.health,
              hunger: existingPet.hunger,
              mood: existingPet.mood,
              nextEmailAt: existingPet.nextEmailAt
            }
          : undefined,
        success: existingPet !== null,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error checking for existing pets",
      };
    }
  },
});
