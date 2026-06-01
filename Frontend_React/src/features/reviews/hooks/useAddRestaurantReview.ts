import { useState } from "react";
import { ReviewService } from "../services/ReviewService";
import type { AddReviewRequest, AddReviewResponse } from "../types/review";

export function useAddRestaurantReview(restaurantId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addReview = async (request: AddReviewRequest): Promise<AddReviewResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ReviewService.addReview(restaurantId, request);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addReview,
    isLoading,
    error,
  };
}
