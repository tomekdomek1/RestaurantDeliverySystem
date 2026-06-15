import useSWR from 'swr';
import { API_BASE_URL } from '../../../config/api';
import type { ReviewsFilter } from '../types/review';

const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE_URL}${url}`);
  if (!res.ok) throw new Error('Błąd pobierania opinii');
  return res.json();
};

export function useGetRestaurantReviews(restaurantId: string | undefined, filters?: Partial<ReviewsFilter>) {
  const queryParams = new URLSearchParams();
  if (filters?.pageNumber) queryParams.append('PageNumber', String(filters.pageNumber));
  if (filters?.pageSize) queryParams.append('PageSize', String(filters.pageSize));
  if (filters?.sortBy) queryParams.append('SortBy', filters.sortBy);
  if (filters?.sortDirection) queryParams.append('SortDirection', filters.sortDirection);
  if (filters?.minRating) queryParams.append('MinRating', String(filters.minRating));
  if (filters?.maxRating) queryParams.append('MaxRating', String(filters.maxRating));

  const query = queryParams.toString();
  const url = restaurantId ? `/api/restaurants/${restaurantId}/reviews${query ? '?' + query : ''}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    reviews: data,
    isLoading,
    error,
    refreshReviews: mutate
  };
}