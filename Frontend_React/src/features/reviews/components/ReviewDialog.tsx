import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ReviewForm from "./ReviewForm";

interface ReviewDialogProps {
  open: boolean;
  restaurantId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function ReviewDialog({
  open,
  restaurantId,
  onClose,
  onSubmitSuccess,
}: ReviewDialogProps) {
  const handleSuccess = () => {
    onSubmitSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dodaj recenzję</DialogTitle>
      <DialogContent>
        <ReviewForm
          restaurantId={restaurantId}
          onSubmitSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
