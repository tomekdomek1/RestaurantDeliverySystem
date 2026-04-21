import type { Category } from "./types/category";
import { List, ListItem, ListItemText, Button, Stack } from "@mui/material";
import { useSnackbar } from "notistack";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  const { enqueueSnackbar } = useSnackbar(); 

  const handleDelete = (id: number) => {
    onDelete(id);
    enqueueSnackbar("Category deleted successfully!", { variant: "success" });
  };

  const handleEdit = (cat: Category) => {
    onEdit(cat);
    enqueueSnackbar("Editing " + cat.name, { variant: "info" });
  };

  return (
    <List>
      {categories.map((cat) => (
        <ListItem
          key={cat.id}
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}
        >
          <ListItemText primary={cat.name} />

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleEdit(cat)}
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(cat.id)}
            >
              Delete
            </Button>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}