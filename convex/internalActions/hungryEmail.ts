import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { EmailTemplates, getEmailTemplate } from "../emailTemplates";

export const hungryEmail = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const users = await ctx.runQuery(internal.internalActions.getUsers.getUsers);

    for (const user of users) {
      if (!user.emailEnabled || !user.pet) {
        continue;
      }

      console.log("Sending email to", user.email);

      await ctx.runAction(internal.internalActions.sendEmail.sendEmail, {
        email: user.email,
        subject: "Hungry Email",
        message: getEmailTemplate(EmailTemplates.HUNGRY, user.pet),
      });
    }

    return null;
  },
});
