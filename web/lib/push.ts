import webpush from "web-push";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: PushPayload
) {
  webpush.setVapidDetails(
    "mailto:suporte@telosapp.com.br",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}

export { webpush };
