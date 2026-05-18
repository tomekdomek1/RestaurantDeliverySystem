import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { useGetRestaurantReviews } from "../hooks/useGetRestaurantReviews";
import ReviewItem from "./ReviewItem";
import type { ReviewsFilter } from "../types/review";

interface ReviewsListProps {
  restaurantId: string;
  onReviewDeleted?: () => void;
}

export default function ReviewsList({
  restaurantId,
  onReviewDeleted,
}: ReviewsListProps) {
  const [filters, setFilters] = useState<Partial<ReviewsFilter>>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  const { reviews, isLoading, error, refreshReviews } = useGetRestaurantReviews(restaurantId, filters);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
  };

  const handleSortChange = (e: any) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any, pageNumber: 1 }));
  };

  const handleDirectionChange = (e: any) => {
    setFilters((prev) => ({ ...prev, sortDirection: e.target.value as any, pageNumber: 1 }));
  };

  const handleRatingFilterChange = (e: any) => {
    const value = e.target.value;
    if (value === "all") {
      setFilters((prev) => ({ ...prev, minRating: undefined, maxRating: undefined, pageNumber: 1 }));
    } else {
      setFilters((prev) => ({ ...prev, minRating: parseInt(value), maxRating: parseInt(value), pageNumber: 1 }));
    }
  };

  const handleRefresh = () => {
    refreshReviews();
  };

  const handleResetFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      sortBy: "createdAt",
      sortDirection: "desc",
    });
  };

  if (isLoading && !reviews) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ py: 2 }}>
        Nie udało się załadować recenzji. Spróbuj ponownie później.
      </Typography>
    );
  }

  return (
    <Box>
      {/* Filters - ZAWSZE widoczne */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sortuj po</InputLabel>
          <Select
            value={filters.sortBy || "createdAt"}
            onChange={handleSortChange}
            label="Sortuj po"
          >
            <MenuItem value="createdAt">Najnowsze</MenuItem>
            <MenuItem value="rating">Ocena</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Kolejność</InputLabel>
          <Select
            value={filters.sortDirection || "desc"}
            onChange={handleDirectionChange}
            label="Kolejność"
          >
            <MenuItem value="desc">Od najnowszych</MenuItem>
            <MenuItem value="asc">Od najstarszych</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Filtr oceny</InputLabel>
          <Select
            value={filters.minRating ? String(filters.minRating) : "all"}
            onChange={handleRatingFilterChange}
            label="Filtr oceny"
          >
            <MenuItem value="all">Wszystkie</MenuItem>
            <MenuItem value="1">1 gwiazdka</MenuItem>
            <MenuItem value="2">2 gwiazdki</MenuItem>
            <MenuItem value="3">3 gwiazdki</MenuItem>
            <MenuItem value="4">4 gwiazdki</MenuItem>
            <MenuItem value="5">5 gwiazdek</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" size="small" onClick={handleRefresh}>
          Odśwież
        </Button>

        <Button variant="outlined" size="small" onClick={handleResetFilters}>
          Resetuj filtry
        </Button>
      </Box>

      {/* Reviews List - warunkowo */}
      <Box
        sx={{ 
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          opacity: isLoading ? 0.5 : 1,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: isLoading ? 'none' : 'auto'
        }}
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 1
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Ładowanie recenzji...
            </Typography>
          </Box>
        ) : (
          <>
            {reviews && reviews.items.length > 0 ? (
              <>
                {reviews.items.map((review) => (
                  <ReviewItem
                    key={review.id}
                    review={review}
                    restaurantId={restaurantId}
                    onDeleted={() => {
                      refreshReviews();
                      onReviewDeleted?.();
                    }}
                  />
                ))}

                {/* Pagination */}
                {reviews.totalCount > (filters.pageSize || 10) && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                      count={Math.ceil(reviews.totalCount / (filters.pageSize || 10))}
                      page={filters.pageNumber || 1}
                      onChange={handlePageChange}
                    />
                  </Box>
                )}

                {/* Info */}
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                  Wyświetlane {reviews.items.length} z {reviews.totalCount} recenzji
                </Typography>
              </>
            ) : (
              <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                Brak recenzji dla tej restauracji.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
