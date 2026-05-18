import { Box, Rating as MuiRating, Typography } from "@mui/material";

interface RatingStarsProps {
  rating: number;
  count?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}

export default function RatingStars({
  rating,
  count,
  readOnly = true,
  onChange,
  size = "medium",
  showLabel = true,
}: RatingStarsProps) {
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <MuiRating
        value={roundedRating}
        readOnly={readOnly}
        onChange={(_, value) => onChange?.(value || 0)}
        size={size}
        precision={0.5}
      />
      {showLabel && (
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {roundedRating.toFixed(1)}
          {count !== undefined && <span> ({count})</span>}
        </Typography>
      )}
    </Box>
  );
}
