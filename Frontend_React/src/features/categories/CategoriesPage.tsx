import { useEffect, useState } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import type { Category } from "./types/category";
import { CategoryService } from "./services/CategoryService";
import { useSnackbar } from "notistack";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading categories";
      setError(message);
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(name: string) {
    try {
      const created = await CategoryService.create({ name });
      setCategories((prev) => [...prev, created]);
      enqueueSnackbar("Category added successfully", { variant: "success" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error adding category";
      enqueueSnackbar(message, { variant: "error" });
    }
  }

  async function handleEdit(id: number, name: string) {
    try {
      const updated = await CategoryService.update(id, { name });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updated : cat))
      );
      setEditingCategory(null);
      enqueueSnackbar("Category updated successfully", { variant: "success" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating category";
      enqueueSnackbar(message, { variant: "error" });
    }
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    try {
      await CategoryService.remove(deleteId);
      setCategories((prev) => prev.filter((cat) => cat.id !== deleteId));
      enqueueSnackbar("Category deleted successfully", { variant: "info" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error deleting category";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Categories</Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <CategoryList
        categories={categories}
        onEdit={setEditingCategory}
        onDelete={(id) => setDeleteId(id)}
      />

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {editingCategory ? "Edit category" : "Add category"}
      </Typography>

      <CategoryForm
        initialValue={editingCategory?.name || ""}
        onSubmit={(name) =>
          editingCategory
            ? handleEdit(editingCategory.id, name)
            : handleAdd(name)
        }
        onCancel={() => setEditingCategory(null)}
      />

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
