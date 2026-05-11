import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Rating,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAddRestaurantReview } from "../hooks/useAddRestaurantReview";
import type { AddReviewRequest } from "../types/review";

interface ReviewFormProps {
  restaurantId: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  restaurantId,
  onSubmitSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { addReview, isLoading, error } = useAddRestaurantReview(restaurantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (rating === null || rating === 0) {
      setValidationError("Proszę wybrać ocenę");
      return;
    }

    if (description.trim().length === 0) {
      setValidationError("Proszę dodać opis recenzji");
      return;
    }

    if (description.length > 1000) {
      setValidationError("Opis nie może zawierać więcej niż 1000 znaków");
      return;
    }

    try {
      const payload: AddReviewRequest = {
        rating,
        description: description.trim(),
      };

      await addReview(payload);
      onSubmitSuccess?.();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Rating Selection */}
      <Box>
        <Typography component="legend" sx={{ mb: 1, fontWeight: 600 }}>
          Ocena restauracji
        </Typography>
        <Rating
          value={rating}
          onChange={(_, value) => setRating(value)}
          size="large"
          sx={{ 
            fontSize: 32,
            color: '#1976d2',
            '& .MuiRating-icon': {
              color: 'rgba(25, 118, 210, 0.2)',
            },
            '& .MuiRating-iconFilled': {
              color: '#1976d2',
            },
            '& .MuiRating-iconHover': {
              color: '#1565c0',
            },
          }}
        />
      </Box>

      {/* Description */}
      <TextField
        label="Opis recenzji"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Podziel się swoją opinią o restauracji..."
        fullWidth
        helperText={`${description.length}/1000 znaków`}
        disabled={isLoading}
      />

      {/* Error Messages */}
      {validationError && <Alert severity="error">{validationError}</Alert>}
      {error && <Alert severity="error">{error.message || "Nie udało się dodać recenzji"}</Alert>}

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
        >
          Anuluj
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? "Dodawanie..." : "Dodaj recenzję"}
        </Button>
      </Box>
    </Box>
  );
}
