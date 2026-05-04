import { messaging } from "../config/firebase";

interface FCMPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export const sendPushNotification = async ({
  token,
  title,
  body,
  data,
}: FCMPayload): Promise<void> => {
  try {
    await messaging.send({
      token,
      notification: { title, body },
      data: data || {},
    });
    console.log("FCM sent successfully");
  } catch (err) {
    console.error("FCM failed (non-fatal):", err);
    // Do not throw — caller must not fail because of this
  }
};
