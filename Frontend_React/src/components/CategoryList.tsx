import type { Category } from "../types/category";
import { List, ListItem, ListItemText, Button, Stack } from "@mui/material";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  return (
    <List>
      {categories.map((cat) => (
        <ListItem
          key={cat.id}
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <ListItemText primary={cat.name} />

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onEdit(cat)}
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete(cat.id)}
            >
              Delete
            </Button>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}
