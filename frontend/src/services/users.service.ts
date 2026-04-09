import axios from 'axios';
import authHeader from '@/services/auth-header.ts';
import { buildApiUrl } from '@/lib/api';

const API_URL = buildApiUrl('user');

export interface User {
  _id: string;
  email: string;
  name: string;
  surname: string;
  enabled: boolean;
  userType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListUsersResponse {
  success: boolean;
  result: User[];
  pagination: {
    page: number;
    pages: number;
    count: number;
  };
  message: string;
}

export interface UserResponse {
  success: boolean;
  result: User;
  message: string;
}

export interface UsersListParams {
  page?: number;
  items?: number;
}

export interface SearchParams {
  q: string;
  fields: string;
}

const getHeaders = () => {
  return {
    headers: authHeader(),
  };
};

class UsersService {
  listUsers(params: UsersListParams = {}) {
    const page = params.page || 1;
    const items = params.items || 10;
    return axios.get<ListUsersResponse>(
      `${API_URL}/list?page=${page}&items=${items}`,
      getHeaders(),
    );
  }

  getUserById(id: string) {
    return axios.get<UserResponse>(`${API_URL}/read/${id}`, getHeaders());
  }

  updateUser(id: string, data: Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>>) {
    return axios.patch<UserResponse>(`${API_URL}/update/${id}`, data, getHeaders());
  }

  updatePassword(id: string, password: string) {
    return axios.patch<UserResponse>(
      `${API_URL}/password-update/${id}`,
      { password },
      getHeaders(),
    );
  }

  deleteUser(id: string) {
    return axios.delete<UserResponse>(`${API_URL}/delete/${id}`, getHeaders());
  }

  searchUsers(query: string, fields: string = 'name,surname,email') {
    return axios.get<{ success: boolean; result: User[]; message: string }>(
      `${API_URL}/search?q=${encodeURIComponent(query)}&fields=${fields}`,
      getHeaders(),
    );
  }
}

export default new UsersService();
