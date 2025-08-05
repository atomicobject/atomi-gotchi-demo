// convex/mutations/updateHealth.ts
import { v } from "convex/values";
import { mutation } from "../_generated/server";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export const updateHealth = mutation({
  args: {
    petId: v.id("pets"),
    delta: v.number(), // positive or negative adjustment
    satisfyEmailAction: v.optional(v.string()), // e.g., "feed" if matching pendingEmailAction
  },
  returns: v.object({
    success: v.boolean(),
    health: v.number(),
    lastInteractionAt: v.string(),
    pendingEmailAction: v.optional(v.string()),
    emailSentAt: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const pet = await ctx.db.get(args.petId);
      if (!pet || !("health" in pet)) {
        return {
          success: false,
          error: "Pet not found",
          health: 0,
          lastInteractionAt: "",
          pendingEmailAction: undefined,
          emailSentAt: undefined,
        };
      }

      const oldHealth = typeof pet.health === "number" ? pet.health : 100;
      const newHealth = clamp(oldHealth + args.delta);
      const updates: any = {
        health: newHealth,
        lastInteractionAt: new Date().toISOString(),
      };

      if (args.satisfyEmailAction) {
        updates.pendingEmailAction = null;
        updates.emailSentAt = null;
      }

      await ctx.db.patch(args.petId, updates);
      const updated = await ctx.db.get(args.petId);

      return {
        success: true,
        health: newHealth,
        lastInteractionAt: updates.lastInteractionAt,
      };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Unknown error",
        health: 0,
        lastInteractionAt: "",
        pendingEmailAction: undefined,
        emailSentAt: undefined,
      };
    }
  },
});
