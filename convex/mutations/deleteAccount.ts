import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const deleteAccount = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .unique();

    if (user) {
      // Delete pet(s) associated with the user
      const pets = await ctx.db
        .query("pets")
        .filter(q => q.eq(q.field("userId"), user._id))
        .collect();
      for (const pet of pets) {
        await ctx.db.delete(pet._id);
      }
      // Delete user account
      await ctx.db.delete(user._id);
    }
    return { success: true };
  },
});
