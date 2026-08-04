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

/**
 * Prefer same-origin `/backend` proxy (see next.config.ts rewrites).
 * Falls back to NEXT_PUBLIC_API_URL when set to an absolute URL without using the proxy.
 */
const getBaseUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

  // In the browser, always use the Next.js rewrite proxy to avoid CORS/CORP failures.
  if (typeof window !== 'undefined') {
    return '/backend';
  }

  // Server-side: talk to API directly when absolute URL is configured.
  if (configured.startsWith('http://') || configured.startsWith('https://')) {
    return configured;
  }

  return configured || 'http://localhost:3001';
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
  const base = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  let url: string;
  if (base.startsWith('http://') || base.startsWith('https://')) {
    const absolute = new URL(`${base}${normalizedPath}`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          absolute.searchParams.set(key, value);
        }
      });
    }
    url = absolute.toString();
  } else {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, value);
        }
      });
    }
    const qs = params.toString();
    url = `${base}${normalizedPath}${qs ? `?${qs}` : ''}`;
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

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AdminApiError(
      'Cannot reach API. Check kavlap-server is running and NEXT_PUBLIC_API_URL is set.',
      0,
    );
  }

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
