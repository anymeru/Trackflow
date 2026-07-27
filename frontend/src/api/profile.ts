import client from "./client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
}

export async function updateProfile(data: { name?: string; phone?: string }): Promise<UserProfile> {
  const { data: res } = await client.patch<UserProfile>("/auth/profile", data);
  return res;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await client.post("/auth/change-password", { currentPassword, newPassword });
}
