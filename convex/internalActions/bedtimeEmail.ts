import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { EmailTemplates, getEmailTemplate } from "../emailTemplates";

export const bedtimeEmail = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const users = await ctx.runQuery(internal.internalActions.getUsers.getUsers);

    for (const user of users) {
      if (!user.emailEnabled) {
        continue;
      }

      const pet = await ctx.runQuery(internal.internalActions.getPetByUserId.getPetByUserId, {
        userId: user.id,
      });

      if (!pet) {
        continue;
      }

      await sleep(1000);
      await ctx.runAction(internal.internalActions.sendEmail.sendEmail, {
        email: user.email,
        subject: `Atomi-Gotchi: 💤 Your pet is going to bed`,
        message: getEmailTemplate(EmailTemplates.BEDTIME, pet),
      });
    }

    return null;
  },
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}