import client from "./client";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>("/auth/login", { email, password });
  return data;
}

export async function register(
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>("/auth/register", {
    email,
    password,
    name,
    phone,
  });
  return data;
}

export async function getMe(): Promise<LoginResponse["user"]> {
  const { data } = await client.get<LoginResponse["user"]>("/auth/me");
  return data;
}
