import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

export const hungryEmail = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const emails = await ctx.runQuery(internal.internalActions.getUserEmails.getUserEmails);

    for (const email of emails) {
      await ctx.runAction(internal.internalActions.sendEmail.sendEmail, { 
        email: email, 
        subject: "Hungry Email", 
        message: "You are hungry",
        emailEnabled: true
      });
    }
    return null;
  },
});
