import useSWR from "swr";
import { ReviewService } from "../services/ReviewService";
import type { ReviewsResponse, ReviewsFilter } from "../types/review";

export function useGetRestaurantReviews(restaurantId?: string | null, filters: Partial<ReviewsFilter> = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append("pageNumber", String(filters.pageNumber ?? 1));
  queryParams.append("pageSize", String(filters.pageSize ?? 10));
  queryParams.append("sortBy", filters.sortBy ?? "createdAt");
  queryParams.append("sortDirection", filters.sortDirection ?? "desc");
  if (filters.minRating !== undefined) queryParams.append("minRating", String(filters.minRating));
  if (filters.maxRating !== undefined) queryParams.append("maxRating", String(filters.maxRating));

  const key = restaurantId ? `/api/restaurants/${restaurantId}/reviews?${queryParams.toString()}` : null;

  const { data, error, isLoading, mutate } = useSWR<ReviewsResponse>(
    key,
    key ? () => ReviewService.getRestaurantReviews(restaurantId!, filters) : null
  );

  return {
    reviews: data,
    isLoading,
    error,
    refreshReviews: mutate,
  };
}
