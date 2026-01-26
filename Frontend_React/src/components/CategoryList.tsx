import type { Category } from "../types/category";
import { List, ListItem, ListItemText, Button, Stack } from "@mui/material";
import type { Category } from "./CategoriesPage";
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
        <li key={cat.id} style={{ marginBottom: 8 }}>
          {cat.name}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => {
                onEdit(cat);
                enqueueSnackbar("Editing " + cat.name, { variant: "info" });
            }}
          >
            Edit
          </button>

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
          <button
            style={{ marginLeft: 5 }}
            onClick={() => handleDelete(cat.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </List>
  );
}