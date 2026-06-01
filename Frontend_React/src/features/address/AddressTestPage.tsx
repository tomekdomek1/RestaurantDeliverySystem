import { useState } from "react";
import {
  Box, Button, Typography, TextField, List, ListItem,
  ListItemText, Divider, CircularProgress, Paper, Stack,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useGetAddresses } from "./hooks/useGetAddresses";
import { useGetAddress } from "./hooks/useGetAddress";
import { useCreateAddress } from "./hooks/useCreateAddress";
import { useEditAddress } from "./hooks/useEditAddress";
import { useDeleteAddress } from "./hooks/useDeleteAddress";
import type { Guid } from "../../api/types/guid";

/**
 * AddressTestPage component for testing CRUD operations on addresses.
 * Integrates with .NET Backend via SWR hooks and Vite Proxy.
 */
export default function AddressTestPage() {
  const { enqueueSnackbar } = useSnackbar();

  // --- State for Creating New Address ---
  const [newStreet, setNewStreet] = useState("");
  const [newBuilding, setNewBuilding] = useState<number | "">("");
  const [newApartment, setNewApartment] = useState<number | "">("");
  const [newCity, setNewCity] = useState("");

  // --- State for Inline Editing ---
  const [editingId, setEditingId] = useState<Guid | null>(null);
  const [editStreet, setEditStreet] = useState("");
  const [editBuilding, setEditBuilding] = useState<number | "">("");
  const [editApartment, setEditApartment] = useState<number | "">("");
  const [editCity, setEditCity] = useState("");

  // --- State for Detail View ---
  const [selectedId, setSelectedId] = useState<Guid | null>(null);
  const [deleteId, setDeleteId] = useState<Guid | null>(null);

  // --- API Hooks (SWR) ---
  const { addresses = [], isLoading: isListLoading, error: listError, refreshAddresses } = useGetAddresses();
  const { address: detail, isLoading: isDetailLoading } = useGetAddress(selectedId);
  const { createAddress, isCreating } = useCreateAddress();
  const { editAddress, isSaving } = useEditAddress();
  const { deleteAddress, isDeleting } = useDeleteAddress();

  // --- Handlers ---

  const handleAdd = async () => {
    if (!newStreet || !newCity || newBuilding === "") return;
    try {
      await createAddress({
        street: newStreet,
        buildingNumber: Number(newBuilding),
        appartmentNumber: Number(newApartment || 0),
        city: newCity
      });
      enqueueSnackbar("Address created successfully!", { variant: "success" });
      setNewStreet("");
      setNewBuilding("");
      setNewApartment("");
      setNewCity("");
      refreshAddresses();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Creation failed";
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const startEditing = (addr: any) => {
    setEditingId(addr.id);
    setEditStreet(addr.street);
    setEditBuilding(addr.buildingNumber);
    setEditApartment(addr.appartmentNumber);
    setEditCity(addr.city);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      // Build PATCH payload dynamically
      const payload: Record<string, unknown> = {};
      if (editStreet.trim()) payload.street = editStreet;
      if (editBuilding !== "") payload.buildingNumber = Number(editBuilding);
      if (editApartment !== "") payload.appartmentNumber = Number(editApartment);
      if (editCity.trim()) payload.city = editCity;

      await editAddress({
        id: editingId,
        data: payload
      });

      enqueueSnackbar("Address updated successfully!", { variant: "info" });
      setEditingId(null);
      refreshAddresses();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Update failed";
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAddress(deleteId);
      enqueueSnackbar("Address removed.", { variant: "warning" });
      refreshAddresses();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Deletion failed";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", p: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
          Address Management Dashboard
        </Typography>

        {/* --- Create Address Section --- */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: '#fcfcfc', border: '1px solid #eee' }}>
          <Typography variant="h6" gutterBottom>Add New Address</Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField label="Street" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} size="small" fullWidth />
              <TextField label="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} size="small" fullWidth />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField label="Bldg No." type="number" value={newBuilding} onChange={(e) => setNewBuilding(e.target.value === "" ? "" : Number(e.target.value))} size="small" fullWidth />
              <TextField label="Apt No." type="number" value={newApartment} onChange={(e) => setNewApartment(e.target.value === "" ? "" : Number(e.target.value))} size="small" fullWidth />
              <Button variant="contained" color="success" onClick={handleAdd} disabled={isCreating} sx={{ minWidth: 120 }}>
                {isCreating ? <CircularProgress size={24} color="inherit" /> : "Create"}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Divider sx={{ mb: 4 }} />

        {/* --- List Section --- */}
        <Typography variant="h5" gutterBottom sx={{ color: '#555' }}>Existing Addresses</Typography>
        {isListLoading && <CircularProgress sx={{ my: 2 }} />}
        {listError && <Typography color="error">Error loading list: {listError.message}</Typography>}

        <List sx={{ width: '100%' }}>
          {addresses.map((addr: any) => (
            <ListItem
              key={addr.id}
              divider
              sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                py: 2,
                bgcolor: editingId === addr.id ? '#e8f5e9' : 'transparent',
                transition: 'background-color 0.3s'
              }}
            >
              {editingId === addr.id ? (
                /* --- Inline Editing Form --- */
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" color="success.main">Editing Mode</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Street" value={editStreet} onChange={(e) => setEditStreet(e.target.value)} size="small" fullWidth />
                    <TextField label="City" value={editCity} onChange={(e) => setEditCity(e.target.value)} size="small" fullWidth />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Bldg No." type="number" value={editBuilding} onChange={(e) => setEditBuilding(e.target.value === "" ? "" : Number(e.target.value))} size="small" fullWidth />
                    <TextField label="Apt No." type="number" value={editApartment} onChange={(e) => setEditApartment(e.target.value === "" ? "" : Number(e.target.value))} size="small" fullWidth />
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button variant="contained" color="success" onClick={handleSaveEdit} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outlined" onClick={() => setEditingId(null)}>Cancel</Button>
                  </Stack>
                </Stack>
              ) : (
                /* --- Standard List Item View --- */
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{addr.street} {addr.buildingNumber}{addr.appartmentNumber ? `/${addr.buildingNumber}` : ""}</Typography>}
                    secondary={`${addr.city} | ID: ${addr.id}`}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="text" onClick={() => setSelectedId(addr.id)}>Details</Button>
                    <Button size="small" variant="outlined" onClick={() => startEditing(addr)}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => setDeleteId(addr.id)} disabled={isDeleting}>Delete</Button>
                  </Stack>
                </Box>
              )}
            </ListItem>
          ))}
        </List>

        {/* --- Details Section --- */}
        {selectedId && (
          <Paper elevation={3} sx={{ p: 3, mt: 4, bgcolor: "#f1f8e9", borderLeft: '6px solid #4caf50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="success.dark">Address Details</Typography>
              <Button size="small" variant="contained" color="inherit" onClick={() => setSelectedId(null)}>Close</Button>
            </Box>

            {isDetailLoading ? (
              <CircularProgress size={30} />
            ) : detail ? (
              <Box>
                <Typography variant="h5" sx={{ mb: 1 }}>{detail.street} {detail.buildingNumber}{detail.appartmentNumber ? `/${detail.buildingNumber}` : ""}</Typography>
                <Typography variant="body1">{detail.city}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>Backend ID: {detail.id}</Typography>
              </Box>
            ) : (
              <Typography color="error">Could not retrieve address data.</Typography>
            )}
          </Paper>
        )}
      </Box>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this address?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
