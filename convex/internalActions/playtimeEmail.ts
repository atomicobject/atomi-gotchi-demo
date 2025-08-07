import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { EmailTemplates, getEmailTemplate } from "../emailTemplates";

export const playtimeEmail = internalAction({
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

      await ctx.runMutation(api.mutations.updateHealth.updateHealth, {
        petId: pet._id,
        delta: -15,
      });

      const updatedPet = await ctx.runQuery(
        internal.internalActions.getPetByUserId.getPetByUserId,
        {
          userId: user.id,
        }
      );

      if (!updatedPet) {
        continue;
      }

      const gameType: EmailTemplates = (() => {
        const randomNum = Math.floor(Math.random() * 3) + 1;
        switch (randomNum) {
          case 1:
            return EmailTemplates.ROCK_PAPER_SCISSORS;
          case 2:
            return EmailTemplates.SIMON_SAYS;
          default:
            return EmailTemplates.ROCK_PAPER_SCISSORS;
        }
      })();
      await sleep(1000); 
      await ctx.runAction(internal.internalActions.sendEmail.sendEmail, {
        email: user.email,
        subject: `Atomi-Gotchi: 🎮 It's time to play with your pet!`,
        message: getEmailTemplate(gameType, updatedPet),
      });
    }

    return null;
  },
});


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}