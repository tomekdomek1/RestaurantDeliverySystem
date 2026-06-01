import { useState } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteRestaurantReview } from "../hooks/useDeleteRestaurantReview";
import RatingStars from "./RatingStars";
import type { Review } from "../types/review";
import { useSnackbar } from "notistack";

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);
      enqueueSnackbar("Recenzja została usunięta", { variant: "info" });
      onDeleted?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nie udało się usunąć recenzji";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setOpenDeleteDialog(false);
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
          </Box>
          {review.isOwnedByCurrentUser && (
            <Box sx={{ ml: 1 }}>
              <IconButton
                size="small"
                onClick={() => setOpenDeleteDialog(true)}
                disabled={isDeleting}
                color="error"
              >
                {isDeleting ? <CircularProgress size={20} /> : <DeleteIcon fontSize="small" />}
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Usuń recenzję</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć tę recenzję? Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Anuluj</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Usuń</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
