const DEFAULT_API_URL = 'http://localhost:8888/api';

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '');
}

export const API_BASE_URL = normalizeBaseUrl(rawApiUrl || DEFAULT_API_URL);

export function buildApiUrl(path = '') {
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';
  return `${API_BASE_URL}${normalizedPath}`;
}
