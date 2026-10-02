import { prisma } from '@/lib/prisma';

/**
 * Server → device push dispatch.
 *
 * Tokens are registered by the mobile app through `POST /api/v1/device-tokens`
 * and stored in `device_tokens` (added to the Prisma schema alongside the app).
 *
 * Two transports are supported so that this file never blocks go-live:
 *
 *   1. FCM HTTP v1 (`FCM_PROJECT_ID` + `FCM_ACCESS_TOKEN`) — the recommended
 *      path. Supply a short-lived OAuth token from your own service-account
 *      tooling, or extend `getAccessToken()` with a signed JWT.
 *   2. Legacy server key (`FCM_SERVER_KEY`) — kept for quick staging tests.
 *
 * With neither configured every call is logged in development and dropped in
 * production, exactly like `src/lib/notifications.ts` does for email and SMS.
 */

export type PushKind = 'notice' | 'appointment' | 'report' | 'system';

export type PushPayload = {
  kind: PushKind;
  title: string;
  body: string;
  refType?: string | null;
  refId?: string | null;
  locale?: 'en' | 'bn';
};

const FCM_PROJECT_ID = process.env.FCM_PROJECT_ID;
const FCM_ACCESS_TOKEN = process.env.FCM_ACCESS_TOKEN;
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;

function isConfigured(): boolean {
  return Boolean((FCM_PROJECT_ID && FCM_ACCESS_TOKEN) || FCM_SERVER_KEY);
}

/** FCM requires every `data` value to be a string. */
function toDataString(payload: PushPayload): Record<string, string> {
  return {
    kind: payload.kind,
    refType: payload.refType ?? '',
    refId: payload.refId ?? '',
    locale: payload.locale ?? 'en',
  };
}

async function sendToToken(token: string, payload: PushPayload): Promise<boolean> {
  const message = {
    message: {
      token,
      notification: { title: payload.title, body: payload.body },
      data: toDataString(payload),
      android: { priority: 'high' as const },
      apns: { payload: { aps: { sound: 'default' } } },
    },
  };

  if (FCM_PROJECT_ID && FCM_ACCESS_TOKEN) {
    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${FCM_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      },
    );
    return response.ok;
  }

  // Legacy transport, used only when FCM_SERVER_KEY is set (staging).
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Authorization: `key=${FCM_SERVER_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      notification: { title: payload.title, body: payload.body },
      data: toDataString(payload),
      priority: 'high',
    }),
  });
  return response.ok;
}

/**
 * Sends a push to every device registered for one patient and prunes tokens FCM
 * reports as gone, so the table does not accumulate dead rows.
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
): Promise<{ sent: number; failed: number; skipped: boolean }> {
  const tokens = await prisma.deviceToken.findMany({ where: { userId } });
  if (tokens.length === 0) return { sent: 0, failed: 0, skipped: false };

  if (!isConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[carepilot:push-preview] ${payload.title} -> ${tokens.length} device(s)`);
    }
    return { sent: 0, failed: 0, skipped: true };
  }

  let sent = 0;
  const dead: string[] = [];

  for (const record of tokens) {
    try {
      const delivered = await sendToToken(record.token, {
        ...payload,
        locale: record.locale,
      });
      if (delivered) sent += 1;
      else dead.push(record.token);
    } catch {
      dead.push(record.token);
    }
  }

  if (dead.length > 0) {
    await prisma.deviceToken.deleteMany({ where: { token: { in: dead } } });
  }

  return { sent, failed: dead.length, skipped: false };
}

export const pushConfigured = isConfigured();
