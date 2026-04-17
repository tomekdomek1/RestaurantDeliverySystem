import { useState } from "react";
import {
  Box, Button, Typography, TextField, List, ListItem,
  ListItemText, Divider, CircularProgress, Paper, Stack
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useGetCategories } from "../hooks/category/useGetCategories";
import { useGetCategory } from "../hooks/category/useGetCategory";
import { useCreateCategory } from "../hooks/category/useCreateCategory";
import { useEditCategory } from "../hooks/category/useEditCategory";
import { useDeleteCategory } from "../hooks/category/useDeleteCategory";
import type { Guid } from "../types/guid";

/**
 * CategoryTestPage component for testing CRUD operations on categories.
 * Integrates with .NET Backend via SWR hooks and Vite Proxy.
 */
export default function CategoryTestPage() {
  const { enqueueSnackbar } = useSnackbar();

  // --- State for Creating New Category ---
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // --- State for Inline Editing ---
  const [editingId, setEditingId] = useState<Guid | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // --- State for Detail View ---
  const [selectedId, setSelectedId] = useState<Guid | null>(null);

  // --- API Hooks (SWR) ---
  const { categories, isLoading: isListLoading, error: listError, refreshCategories } = useGetCategories();
  const { category: detail, isLoading: isDetailLoading } = useGetCategory(selectedId);
  const { createCategory, isCreating } = useCreateCategory();
  const { editCategory, isSaving } = useEditCategory();
  const { deleteCategoy, isDeleting } = useDeleteCategory();

  // --- Handlers ---

  const handleAdd = async () => {
    if (!newName) return;
    try {
      await createCategory({ name: newName, description: newDesc });
      enqueueSnackbar("Category created successfully!", { variant: "success" });
      setNewName("");
      setNewDesc("");
      refreshCategories(); // Revalidate SWR cache
    } catch (e: any) {
      enqueueSnackbar(`Creation failed: ${e.message}`, { variant: "error" });
    }
  };

  const startEditing = (id: Guid, currentName: string, currentDesc: string) => {
    setEditingId(id);
    setEditName(currentName);
    setEditDesc(currentDesc || "");
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      // Build the update payload dynamically.
      // In PATCH requests, we only send fields that we want to change.
      const payload: any = {};
      if (editName.trim()) payload.name = editName;
      if (editDesc.trim()) payload.description = editDesc;

      await editCategory({
        id: editingId,
        data: payload
      });

      enqueueSnackbar("Category updated successfully!", { variant: "info" });
      setEditingId(null);
      refreshCategories();
    } catch (e: any) {
      enqueueSnackbar(`Update failed: ${e.message}`, { variant: "error" });
    }
  };
  const handleDelete = async (id: Guid) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategoy(id);
      enqueueSnackbar("Category removed.", { variant: "warning" });
      refreshCategories();
    } catch (e: any) {
      enqueueSnackbar(`Deletion failed: ${e.message}`, { variant: "error" });
    }
  };

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", p: 4 }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Category Management Dashboard
        </Typography>

        {/* --- Create Category Section --- */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: '#fcfcfc', border: '1px solid #eee' }}>
          <Typography variant="h6" gutterBottom>Add New Category</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Category Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Description (Optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={isCreating}
              sx={{ minWidth: 120 }}
            >
              {isCreating ? <CircularProgress size={24} color="inherit" /> : "Create"}
            </Button>
          </Stack>
        </Paper>

        <Divider sx={{ mb: 4 }} />

        {/* --- List Section --- */}
        <Typography variant="h5" gutterBottom sx={{ color: '#555' }}>Existing Categories</Typography>
        {isListLoading && <CircularProgress sx={{ my: 2 }} />}
        {listError && <Typography color="error">Error loading list: {listError.message}</Typography>}

        <List sx={{ width: '100%' }}>
          {categories.map((cat) => (
            <ListItem
              key={cat.id}
              divider
              sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                py: 2,
                bgcolor: editingId === cat.id ? '#fff9c4' : 'transparent',
                transition: 'background-color 0.3s'
              }}
            >
              {editingId === cat.id ? (
                /* --- Inline Editing Form --- */
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" color="primary">Editing Mode</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Edit Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Edit Description"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button variant="contained" color="success" onClick={handleSaveEdit} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outlined" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                /* --- Standard List Item View --- */
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{cat.name}</Typography>}
                    secondary={
                      <Box component="span">
                        <Typography variant="body2" color="text.secondary">
                          {cat.description || "No description provided"}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#aaa' }}>
                          ID: {cat.id}
                        </Typography>
                      </Box>
                    }
                  />
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="text" onClick={() => setSelectedId(cat.id)}>
                      Details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => startEditing(cat.id, cat.name, cat.description)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(cat.id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>
              )}
            </ListItem>
          ))}
        </List>

        {/* --- Details Section (useCategory Hook) --- */}
        {selectedId && (
          <Paper elevation={3} sx={{ p: 3, mt: 4, bgcolor: "#e3f2fd", borderLeft: '6px solid #2196f3' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="primary">Category Details (Real-time Fetch)</Typography>
              <Button size="small" variant="contained" color="inherit" onClick={() => setSelectedId(null)}>Close</Button>
            </Box>

            {isDetailLoading ? (
              <CircularProgress size={30} />
            ) : detail ? (
              <Box>
                <Typography variant="h5" sx={{ mb: 1 }}>{detail.name}</Typography>
                <Typography variant="body1" sx={{ color: detail.description ? 'inherit' : 'text.secondary' }}>
                  {detail.description || "Description is empty for this category."}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary', borderTop: '1px solid #bbdefb', pt: 1 }}>
                  Backend ID: {detail.id}
                </Typography>
              </Box>
            ) : (
              <Typography color="error">Could not retrieve category data.</Typography>
            )}
          </Paper>
        )}

        {/* --- Global Loading Indicator --- */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          {(isCreating || isSaving || isDeleting) && (
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 1.5 }}>
              Syncing with database...
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
