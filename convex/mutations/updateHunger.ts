import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const updateHunger = mutation({
  args: {
    petId: v.id("pets"),
    delta: v.number(),
  },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet) {
      throw new Error("Pet not found");
    }
    // Clamp hunger between 0 and 100
    const oldHunger = pet.hunger || 0;
    const newHunger = Math.max(0, Math.min(100, oldHunger + args.delta));
    await ctx.db.patch(args.petId, { hunger: newHunger });
    return { success: true, hunger: newHunger };
  },
});