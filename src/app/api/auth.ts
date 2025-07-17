// src/shared/api/auth.ts
import { User } from '@/types/user';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function register(data: {
  email: string;
  password: string;
  name: string;
}) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { message, userId }
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json(); // { token }
}

export async function fetchMe(token: string) {
  const res = await fetch('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw await res.json();
  return res.json() as Promise<{ user: User }>;
}
