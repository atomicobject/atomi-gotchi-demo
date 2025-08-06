"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { sendEmailHelper } from "../sendEmail";

export const sendEmail = internalAction({
  args: {
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    return await sendEmailHelper(args);
  },
});
