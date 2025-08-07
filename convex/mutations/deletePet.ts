import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const deletePet = mutation({
  args: {
    petId: v.id("pets"),
  },
  handler: async (ctx, { petId }) => {
    // Remove the pet document entirely
    await ctx.db.delete(petId);
    return { success: true };
  },
});
