import { useState } from "react";
import { Box, Button, Typography, Divider, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../auth/hooks/useAuth";
import ReviewDialog from "./ReviewDialog";
import ReviewsList from "./ReviewsList";
// DODANY IMPORT:
import RatingStars from "./RatingStars";

// Rozszerzamy interfejs propsów o dane z restauracji
interface ReviewsSectionProps {
  restaurantId: string;
  averageRating: number;
  totalReviews: number;
}

export default function ReviewsSection({ restaurantId, averageRating, totalReviews }: ReviewsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenDialog = () => {
    if (!isLoggedIn) {
      alert("Musisz być zalogowany, aby dodać recenzję");
      return;
    }
    setDialogOpen(true);
  };

  const handleReviewAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        
        {/* Grupa: Tytuł + Gwiazdki ustawione poziomo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Recenzje i oceny
          </Typography>
          
          {totalReviews > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", pt: 0.5 }}>
              <RatingStars 
                rating={averageRating} 
                count={totalReviews}
                readOnly
                size="medium"
                showLabel
              />
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          size="small"
        >
          Dodaj recenzję
        </Button>
      </Box>

      {!isLoggedIn && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Zaloguj się, aby móc dodać recenzję i ocenić restaurację.
        </Alert>
      )}

      <Divider sx={{ mb: 3 }} />

      <ReviewDialog
        open={dialogOpen}
        restaurantId={restaurantId}
        onClose={() => setDialogOpen(false)}
        onSubmitSuccess={handleReviewAdded}
      />

      <ReviewsList
        key={refreshKey}
        restaurantId={restaurantId}
        onReviewDeleted={handleReviewAdded}
      />
    </Box>
  );
}