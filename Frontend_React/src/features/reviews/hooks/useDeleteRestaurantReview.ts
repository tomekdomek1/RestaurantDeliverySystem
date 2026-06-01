import { useState } from "react";
import { ReviewService } from "../services/ReviewService";

export function useDeleteRestaurantReview(restaurantId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteReview = async (reviewId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await ReviewService.deleteReview(restaurantId, reviewId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteReview,
    isLoading,
    error,
  };
}
