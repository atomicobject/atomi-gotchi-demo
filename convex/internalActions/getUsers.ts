import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getUsers = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      id: v.id("users"),
      email: v.string(),
      emailEnabled: v.optional(v.boolean()),
    })
  ),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((user) => ({
      id: user._id,
      email: user.email,
      emailEnabled: user.emailEnabled,
    }));
  },
});
