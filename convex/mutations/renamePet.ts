import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const renamePet = mutation({
  args: {
    email: v.string(),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    // First find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) throw new Error("User not found");

    // Now find the pet by userId
    const pet = await ctx.db
      .query("pets")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!pet) throw new Error("Pet not found");
    await ctx.db.patch(pet._id, { name: args.newName });
    return { success: true };
  },
});