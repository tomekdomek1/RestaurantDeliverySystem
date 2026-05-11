import { fetcher, postMutation, deleteMutation } from "../../../api/core";
import type { ReviewsFilter, ReviewsResponse, AddReviewRequest, AddReviewResponse } from "../types/review";

const BASE = "/api/restaurants";

export const ReviewService = {
  async getRestaurantReviews(restaurantId: string, filters: Partial<ReviewsFilter> = {}): Promise<ReviewsResponse> {
    const params = new URLSearchParams();
    params.append("pageNumber", String(filters.pageNumber ?? 1));
    params.append("pageSize", String(filters.pageSize ?? 10));
    params.append("sortBy", filters.sortBy ?? "createdAt");
    params.append("sortDirection", filters.sortDirection ?? "desc");
    
    if (filters.minRating !== undefined) {
      params.append("minRating", String(filters.minRating));
    }
    if (filters.maxRating !== undefined) {
      params.append("maxRating", String(filters.maxRating));
    }

    const url = `${BASE}/${restaurantId}/reviews?${params.toString()}`;
    return fetcher<ReviewsResponse>(url);
  },

  async addReview(restaurantId: string, payload: AddReviewRequest): Promise<AddReviewResponse> {
    const url = `${BASE}/${restaurantId}/reviews`;
    return postMutation<AddReviewResponse, AddReviewRequest>(url, { arg: payload });
  },

  async deleteReview(restaurantId: string, reviewId: string): Promise<void> {
    const url = `${BASE}/${restaurantId}/reviews`;
    return deleteMutation<void, string>(url, { arg: reviewId });
  },
};
