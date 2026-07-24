import client from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  _count?: { messages: number };
}

export async function getUsers(): Promise<User[]> {
  const { data } = await client.get<User[]>("/users");
  return data;
}

export async function updateUserRole(id: string, role: string): Promise<User> {
  const { data } = await client.patch<User>(`/users/${id}`, { role });
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await client.delete(`/users/${id}`);
}
