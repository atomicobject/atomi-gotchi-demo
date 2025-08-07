import { v } from "convex/values";
import { mutation } from "../_generated/server";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export const updateHunger = mutation({
  args: {
    petId: v.id("pets"),
    delta: v.number(),
    satisfyEmailAction: v.optional(v.string()), // e.g., "feed" if matching pendingEmailAction
  },
  returns: v.object({
    success: v.boolean(),
    hunger: v.number(),
    lastInteractionAt: v.string(),
    pendingEmailAction: v.optional(v.string()),
    emailSentAt: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const pet = await ctx.db.get(args.petId);
      if (!pet || !('hunger' in pet)) {
        return {
          success: false,
          error: "Pet not found",
          hunger: 0,
          lastInteractionAt: "",
          pendingEmailAction: undefined,
          emailSentAt: undefined,
        };
      }

      const oldHunger = typeof pet.hunger === "number" ? pet.hunger : 100;
      const newHunger = clamp(oldHunger + args.delta);
      const updates: any = {
        hunger: newHunger,
        lastInteractionAt: new Date().toISOString(),
      };

      if (args.satisfyEmailAction && pet.pendingEmailAction === args.satisfyEmailAction) {
        updates.pendingEmailAction = null;
        updates.emailSentAt = null;
      }

      await ctx.db.patch(args.petId, updates);
      const updated = await ctx.db.get(args.petId);

      return {
        success: true,
        hunger: newHunger,
        lastInteractionAt: updates.lastInteractionAt,
        pendingEmailAction: updated?.pendingEmailAction,
        emailSentAt: updated?.emailSentAt,
      };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Unknown error",
        hunger: 0,
        lastInteractionAt: "",
        pendingEmailAction: undefined,
        emailSentAt: undefined,
      };
    }
  },
});
