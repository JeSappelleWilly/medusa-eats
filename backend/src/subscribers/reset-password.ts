import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa";

export default async function handleAdminPasswordReset({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs<Record<string, string>>) {
  const sendGridService = container.resolve("sendgridService");

  const resetPasswordLink =
    process.env.RAILWAY_PUBLIC_DOMAIN + "/reset-password?token=" + data.token;

  const templateId = process.env.SENDGRID_RESET_ADMIN_PASSWORD_TEMPLATE_EN;

  sendGridService
    .sendEmail({
      templateId: templateId,
      from: process.env.SENDGRID_FROM,
      to: data.email,
      dynamic_template_data: {
        reset_password_link: resetPasswordLink,
      },
    })
    .catch((err) => {
      // Handle SendGrid error (optional: add logging here)
    });
}

export const config: SubscriberConfig = {
  event: "user.password_reset",
  context: {
    subscriberId: "reset-admin-password-handler",
  },
};
