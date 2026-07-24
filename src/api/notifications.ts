import client from "./client";

export interface NotificationLogEntry {
  id: string;
  trackingId: string;
  recipientEmail: string;
  type: string;
  subject: string;
  body: string;
  sentAt: string;
  tracking?: { trackingNumber: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalTrackings: number;
  deliveryRate: number;
  statusCounts: Array<{ status: string; count: number }>;
  recentTrackings: Array<{
    id: string;
    trackingNumber: string;
    clientName: string;
    status: string;
    updatedAt: string;
  }>;
  disputesOpen: number;
}

export async function getNotificationLog(params?: {
  type?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<NotificationLogEntry>> {
  const { data } = await client.get<PaginatedResponse<NotificationLogEntry>>(
    "/notifications/log",
    { params }
  );
  return data;
}

export async function getStats(): Promise<DashboardStats> {
  const { data } = await client.get<DashboardStats>("/notifications/stats");
  return data;
}
