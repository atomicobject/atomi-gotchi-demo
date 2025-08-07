import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
//crons.interval(
//   "Send pet playtime emails",
//   { minutes: 1 },
//   internal.internalActions.playtimeEmail.playtimeEmail
//);

crons.cron(
  "Send pet hungry emails (9am EDT)",
  "0 13 * * *",
  internal.internalActions.hungryEmail.hungryEmail
);

crons.cron(
  "Send pet playtime emails (12pm EDT)",
  "0 16 * * *", // Run at 12pm EDT (16:00 UTC)
  internal.internalActions.playtimeEmail.playtimeEmail
);

crons.cron(
  "Send pet playtime emails (6pm EDT)",
  "0 22 * * *",
  internal.internalActions.playtimeEmail.playtimeEmail
);

crons.cron(
  "Send pet bedtime emails (9pm EDT)",
  "0 1 * * *",
  internal.internalActions.bedtimeEmail.bedtimeEmail
);

export default crons;
