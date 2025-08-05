import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// crons.interval(
//   "send email to georgia", 
//   { minutes: 1 }, 
//   internal.internalActions.hungryEmail.hungryEmail
// );

export default crons;

