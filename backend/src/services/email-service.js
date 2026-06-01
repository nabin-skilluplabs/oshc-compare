import { Resend } from "resend";
import { prisma } from "../lib/prisma.js";
import { jsonString } from "../lib/json-field.js";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOrderEmail({ orderId, to, subject, templateKey, html, metadata = {} }) {
  const log = await prisma.emailLog.create({
    data: {
      orderId,
      recipientEmail: to,
      templateKey,
      status: "queued",
      provider: resend ? "resend" : "development_log",
      subject,
      metadata: jsonString(metadata),
    },
  });

  if (!resend) {
    console.log(`[email:${templateKey}] ${to} - ${subject}`);
    return prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "sent",
        sentAt: new Date(),
        providerMessageId: `dev-${log.id}`,
      },
    });
  }

  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "OSHC Compare <no-reply@example.com>",
      to,
      subject,
      html,
    });

    return prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "sent",
        sentAt: new Date(),
        providerMessageId: response.data?.id,
      },
    });
  } catch (error) {
    return prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "failed",
        errorMessage: error.message,
      },
    });
  }
}
