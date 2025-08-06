import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Send pet playtime emails (every 10 minutes)",
  { minutes: 10 },
  internal.internalActions.hungryEmail.hungryEmail
);

crons.cron(
  "Send pet hungry emails (9am EDT)",
  "0 13 * * *",
  internal.internalActions.hungryEmail.hungryEmail
);

crons.cron(
  "Send pet hungry emails (6pm EDT)",
  "0 22 * * *",
  internal.internalActions.hungryEmail.hungryEmail
);

export default crons;
