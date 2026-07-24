import client from "./client";

export interface Conversation {
  id: string;
  trackingId: string;
  trackingNumber: string;
  subject: string;
  clientName: string;
  clientEmail: string;
  status: string;
  priority: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await client.get<Conversation[]>("/conversations");
  return data;
}

export interface ChatMessage {
  id: string;
  senderId: string | null;
  senderRole: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  sender?: { name: string } | null;
}

export async function getMessages(trackingId: string): Promise<ChatMessage[]> {
  const { data } = await client.get<ChatMessage[]>(`/trackings/${trackingId}/messages`);
  return data;
}

export async function sendMessage(trackingId: string, body: string): Promise<ChatMessage> {
  const { data } = await client.post<ChatMessage>(`/trackings/${trackingId}/messages`, { body });
  return data;
}

export async function markAllConversationsRead(): Promise<void> {
  await client.patch("/conversations/read-all");
}
