// convex/mutations/updateHealth.ts
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const updateHealth = mutation({
  args: {
    petId: v.id("pets"),
    delta: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    health: v.number(),
  }),
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet) {
      throw new Error("Pet not found");
    }
    // Clamp health between 0 and 100
    const oldHealth = pet.health || 0;
    const newHealth = Math.max(0, Math.min(100, oldHealth + args.delta));
    await ctx.db.patch(args.petId, { health: newHealth });
    return { success: true, health: newHealth };
  },
});
