import client from "./client";

export async function getSettings(): Promise<Record<string, string>> {
  const { data } = await client.get<Record<string, string>>("/settings");
  return data;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await client.put("/settings", { key, value });
}
