import { useState } from "react";
import { Box, Card, CardContent, Typography, IconButton, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteRestaurantReview } from "../hooks/useDeleteRestaurantReview";
import RatingStars from "./RatingStars";
import type { Review } from "../types/review";

interface ReviewItemProps {
  review: Review;
  restaurantId: string;
  onDeleted?: () => void;
}

export default function ReviewItem({
  review,
  restaurantId,
  onDeleted,
}: ReviewItemProps) {
  const { deleteReview, isLoading: isDeleting } = useDeleteRestaurantReview(restaurantId);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć tę recenzję?")) return;

    try {
      setError(null);
      await deleteReview(review.id);
      onDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się usunąć recenzji");
    }
  };

  const createdDate = new Date(review.createdAt).toLocaleDateString("pl-PL");

  return (
    <Card sx={{ mb: 2, position: "relative" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <RatingStars rating={review.rating} readOnly showLabel size="small" />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {createdDate}
            </Typography>
            {review.description && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {review.description}
              </Typography>
            )}
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                {error}
              </Typography>
            )}
          </Box>
          {review.isOwnedByCurrentUser && (
            <Box sx={{ ml: 1 }}>
              <IconButton
                size="small"
                onClick={handleDelete}
                disabled={isDeleting}
                color="error"
              >
                {isDeleting ? <CircularProgress size={20} /> : <DeleteIcon fontSize="small" />}
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
