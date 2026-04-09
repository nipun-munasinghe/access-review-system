import authService from '@/services/auth.service.ts';

export default function authHeader() {
  const token = authService.getToken();

  if (token) {
    return { 'x-auth-token': token };
  } else {
    return { 'x-auth-token': '' };
  }
}
