import axios from 'axios';
import type {
  AccessibilityReview,
  ReviewMutationPayload,
  ReviewListResponse,
  ReviewResponse,
  ReviewSearchResponse,
  SpaceReviewSummaryResponse,
  SpaceReviewWeatherResponse,
} from '../types/review.type';
import authHeader from '@/services/auth-header.ts';
import { buildApiUrl } from '@/lib/api';

const API_URL = buildApiUrl('review');

const getHeaders = () => {
  return {
    headers: authHeader(),
  };
};

type ReviewListFilters = {
  spaceId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
};

class ReviewService {
  createReview(payload: ReviewMutationPayload) {
    return axios.post<ReviewResponse>(`${API_URL}/create`, payload, getHeaders());
  }

  getAllReviews(page = 1, items = 10, filters?: ReviewListFilters) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('items', items.toString());

    if (filters?.spaceId) params.append('spaceId', filters.spaceId);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.minRating !== undefined) params.append('minRating', filters.minRating.toString());
    if (filters?.maxRating !== undefined) params.append('maxRating', filters.maxRating.toString());

    return axios.get<ReviewListResponse>(`${API_URL}/list?${params.toString()}`);
  }

  searchReviews(query: string, spaceId?: string) {
    const params = new URLSearchParams();
    params.append('q', query);
    if (spaceId) params.append('spaceId', spaceId);

    return axios.get<ReviewSearchResponse>(`${API_URL}/search?${params.toString()}`);
  }

  getReviewById(id: string) {
    return axios.get<ReviewResponse>(`${API_URL}/read/${id}`);
  }

  updateReview(id: string, payload: ReviewMutationPayload) {
    return axios.patch<ReviewResponse>(`${API_URL}/update/${id}`, payload, getHeaders());
  }

  getMyReviews(page = 1, items = 10) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('items', items.toString());

    return axios.get<ReviewListResponse>(`${API_URL}/my-reviews?${params.toString()}`, getHeaders());
  }

  getReviewsBySpace(spaceId: string, page = 1, items = 10) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('items', items.toString());

    return axios.get<ReviewListResponse>(`${API_URL}/space/${spaceId}?${params.toString()}`);
  }

  getSpaceSummary(spaceId: string) {
    return axios.get<SpaceReviewSummaryResponse>(`${API_URL}/space/${spaceId}/summary`);
  }

  getSpaceWeather(spaceId: string) {
    return axios.get<SpaceReviewWeatherResponse>(`${API_URL}/space/${spaceId}/weather`);
  }

  deleteReview(id: string) {
    return axios.delete<{ success: boolean; result: AccessibilityReview; message: string }>(
      `${API_URL}/delete/${id}`,
      getHeaders(),
    );
  }
}

export default new ReviewService();
