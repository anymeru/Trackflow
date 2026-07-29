import client, { publicClient } from "./client";

export interface Dispute {
  id: string;
  trackingId: string;
  clientId: string | null;
  reason: string;
  description: string;
  status: string;
  adminResponse: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export async function getDisputes(
  trackingId: string
): Promise<Dispute[]> {
  const { data } = await client.get<Dispute[]>(
    `/trackings/${trackingId}/disputes`
  );
  return data;
}

export async function openDispute(
  trackingId: string,
  payload: { reason: string; description: string }
): Promise<Dispute> {
  const { data } = await client.post<Dispute>(
    `/trackings/${trackingId}/disputes`,
    payload
  );
  return data;
}

export async function openDisputePublic(
  payload: {
    trackingId: string;
    reason: string;
    description: string;
    clientName?: string;
    clientEmail?: string;
  }
): Promise<Dispute> {
  const { data } = await publicClient.post<Dispute>(
    `/public/disputes`,
    payload
  );
  return data;
}

export async function resolveDispute(
  trackingId: string,
  disputeId: string,
  adminResponse: string
): Promise<Dispute> {
  const { data } = await client.patch<Dispute>(
    `/trackings/${trackingId}/disputes/${disputeId}/resolve`,
    { adminResponse }
  );
  return data;
}
