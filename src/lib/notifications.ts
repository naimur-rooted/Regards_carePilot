/**
 * Notification dispatch placeholders.
 *
 * These functions deliberately do not send anything yet. They exist so that
 * every request flow has a single place to hook a real provider (Resend,
 * Postmark or SES for email; Twilio, SSLWireless or Bulk SMS BD for SMS)
 * without touching the request handlers.
 *
 * IMPORTANT: never log full patient contact details in production.
 */
type EmailPayload = {
  to: string;
  subject: string;
  body: string;
  reference?: string;
};

type SmsPayload = {
  to: string;
  body: string;
};

function isConfigured(channel: 'email' | 'sms'): boolean {
  return channel === 'email'
    ? Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)
    : Boolean(process.env.SMS_PROVIDER_API_KEY);
}

export async function sendEmail(payload: EmailPayload): Promise<{ sent: boolean; queued: boolean }> {
  if (!isConfigured('email')) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[carepilot:email-preview] ${payload.subject} -> ${payload.to}`);
    }
    return { sent: false, queued: true };
  }

  // TODO: replace with the real provider call, for example:
  // await resend.emails.send({ from: process.env.NOTIFICATION_EMAIL_FROM!, ... })
  return { sent: false, queued: true };
}

export async function sendSms(payload: SmsPayload): Promise<{ sent: boolean; queued: boolean }> {
  if (!isConfigured('sms')) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[carepilot:sms-preview] message queued for ${payload.to.slice(0, 4)}****`);
    }
    return { sent: false, queued: true };
  }

  return { sent: false, queued: true };
}

/**
 * Human-readable reference code for a submitted request, for example
 * CP-SC-8F3K2 or CP-AP-1A9X4.
 */
export function referenceCode(prefix: 'SC' | 'AP' | 'CT'): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let index = 0; index < 5; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CP-${prefix}-${code}`;
}
