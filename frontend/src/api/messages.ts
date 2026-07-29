import client, { publicClient } from "./client";

export interface Message {
  id: string;
  trackingId: string;
  senderId: string | null;
  senderRole: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  sender?: { name: string } | null;
}

export async function getMessages(
  trackingId: string
): Promise<Message[]> {
  const { data } = await client.get<Message[]>(
    `/trackings/${trackingId}/messages`
  );
  return data;
}

export async function sendMessage(
  trackingId: string,
  body: string
): Promise<Message> {
  const { data } = await client.post<Message>(
    `/trackings/${trackingId}/messages`,
    { body }
  );
  return data;
}

export async function markMessagesAsRead(
  trackingId: string
): Promise<void> {
  await client.patch(`/trackings/${trackingId}/messages/read`);
}

export async function getMessagesPublic(
  trackingId: string
): Promise<Message[]> {
  const { data } = await publicClient.get<Message[]>(
    `/public/messages/${trackingId}`
  );
  return data;
}

export async function sendMessagePublic(
  trackingId: string,
  body: string,
  senderName?: string
): Promise<Message> {
  const { data } = await publicClient.post<Message>("/public/messages", {
    trackingId,
    body,
    senderName,
  });
  return data;
}
