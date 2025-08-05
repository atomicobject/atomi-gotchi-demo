import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getUserEmails = internalQuery({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((user) => user.email);
  },
});
