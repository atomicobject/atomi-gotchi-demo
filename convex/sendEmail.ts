"use node";

import { v } from "convex/values";
import { Resend } from "resend";
import { action, internalAction } from "./_generated/server";

async function sendEmailHelper(args: { email: string; subject: string; message: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "Atomi-Gotchi",
      to: [args.email],
      subject: args.subject,
      html: args.message,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export const sendEmail = action({
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

// Internal action for cron jobs to call
export const sendEmailInternal = internalAction({
  args: {
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await sendEmailHelper(args);
    return null;
  },
});
