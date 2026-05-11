import { useState } from "react";
import { Box, Button, Typography, Divider, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../auth/hooks/useAuth";
import ReviewDialog from "./ReviewDialog";
import ReviewsList from "./ReviewsList";

interface ReviewsSectionProps {
  restaurantId: string;
}

export default function ReviewsSection({ restaurantId }: ReviewsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
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
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Recenzje i oceny
        </Typography>
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
        currentUserId={user?.id}
        onReviewDeleted={handleReviewAdded}
      />
    </Box>
  );
}
