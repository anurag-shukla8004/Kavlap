import { clearAdminSession, getAdminToken } from './auth';
import type { ApiError, ApiSuccess } from './types';

export class AdminApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AdminApiError';
    this.statusCode = statusCode;
  }
}

const getBaseUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new AdminApiError('NEXT_PUBLIC_API_URL is not configured', 500);
  }
  return base.replace(/\/$/, '');
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | undefined>;
};

export async function adminFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, auth = true, query } = options;

  const url = new URL(`${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAdminToken();
    if (!token) {
      throw new AdminApiError('Not authenticated', 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload: ApiSuccess<T> | ApiError | null = null;
  try {
    payload = (await response.json()) as ApiSuccess<T> | ApiError;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearAdminSession();
    }
    const message =
      payload && 'message' in payload
        ? payload.message
        : `Request failed (${response.status})`;
    throw new AdminApiError(message, response.status);
  }

  if (!payload || !('success' in payload) || !payload.success) {
    throw new AdminApiError('Unexpected API response', response.status);
  }

  return payload.data;
}
