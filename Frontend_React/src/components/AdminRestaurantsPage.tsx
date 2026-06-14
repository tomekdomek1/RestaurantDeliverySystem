import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, IconButton, Tooltip, Autocomplete, InputAdornment, Divider 
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { API_BASE_URL } from '../config/api';

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]); 
  const [search, setSearch] = useState('');
  
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [form, setForm] = useState({ 
    id: '', name: '', phone: '', desc: '', addressId: '', ownerEmail: '',
    addressCity: '', addressStreet: '', addressBuilding: '', addressAppartment: '' 
  });

  useEffect(() => {
    fetchOwners();
    fetchRestaurants();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/owners`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }});
      if (response.ok) setOwners(await response.json());
    } catch (err) { console.error(err); }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurants`);
      if (response.ok) {
        const data = await response.json();
        const parsedRestaurants = data.map((r: any) => {
          const match = r.descrition?.match(/\[OWNER:(.+?)\]/);
          let owner = "Brak";
          let cleanDesc = r.descrition || "";
          if (match) {
            owner = match[1];
            cleanDesc = cleanDesc.replace(/\[OWNER:.*?\]/g, '').trim();
          }
          return { ...r, ownerEmail: owner, cleanDesc };
        });
        setRestaurants(parsedRestaurants);
      }
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    setStatus({ type: '', message: '' });
    try {
      let finalAddressId = form.addressId;
      if (!isEditing) {
        const addrResp = await fetch(`${API_BASE_URL}/api/addresses`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }, body: JSON.stringify({ city: form.addressCity, street: form.addressStreet, buildingNumber: parseInt(form.addressBuilding) || 0, appartmentNumber: parseInt(form.addressAppartment) || 0 })});
        if (!addrResp.ok) throw new Error('Błąd adresu.');
        finalAddressId = (await addrResp.json()).id; 
      } else {
        const addrResp = await fetch(`${API_BASE_URL}/api/addresses/${finalAddressId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }, body: JSON.stringify({ city: form.addressCity, street: form.addressStreet, buildingNumber: parseInt(form.addressBuilding) || 0, appartmentNumber: parseInt(form.addressAppartment) || 0 })});
        if (!addrResp.ok) throw new Error('Błąd aktualizacji adresu.');
      }

      const url = isEditing ? `${API_BASE_URL}/api/restaurants/${form.id}` : `${API_BASE_URL}/api/restaurants`;
      const desc = `${form.desc} [OWNER:${form.ownerEmail}]`;
      const response = await fetch(url, { method: isEditing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }, body: JSON.stringify({ name: form.name, phoneNumber: form.phone, descrition: desc, addressId: finalAddressId })});
      
      if (!response.ok) throw new Error('Błąd zapisywania restauracji.');
      
      setOpenModal(false); 
      fetchRestaurants(); 
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
  };

  const handleDelete = async (restId: string) => {
    if (!window.confirm('Czy usunąć bezpowrotnie tę restaurację?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurants/${restId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }});
      if (!response.ok) throw new Error('Błąd usuwania restauracji.');
      fetchRestaurants();
    } catch (err: any) { alert(`Błąd: ${err.message}`); }
  };

  const openEdit = async (rest: any) => {
    setIsEditing(true);
    setForm({ id: rest.id, name: rest.name, phone: rest.phoneNumber, desc: rest.cleanDesc, addressId: rest.addressId, ownerEmail: rest.ownerEmail, addressCity: 'Ładowanie...', addressStreet: 'Ładowanie...', addressBuilding: '', addressAppartment: '' });
    setStatus({ type: '', message: '' }); 
    setOpenModal(true);
    try {
      const addrResp = await fetch(`${API_BASE_URL}/api/addresses/${rest.addressId}`);
      if(addrResp.ok) {
        const addrData = await addrResp.json();
        setForm(prev => ({ ...prev, addressCity: addrData.city || '', addressStreet: addrData.street || '', addressBuilding: addrData.buildingNumber?.toString() || '', addressAppartment: addrData.appartmentNumber?.toString() || '' }));
      }
    } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    setIsEditing(false);
    setForm({ id: '', name: '', phone: '', desc: '', addressId: '', ownerEmail: '', addressCity: '', addressStreet: '', addressBuilding: '', addressAppartment: '' });
    setStatus({ type: '', message: '' });
    setOpenModal(true);
  };

  const filteredRestaurants = restaurants.filter(r => (r.name?.toLowerCase() || '').includes(search.toLowerCase()) || (r.ownerEmail?.toLowerCase() || '').includes(search.toLowerCase()) || (r.phoneNumber || '').includes(search));

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Zarządzanie Restauracjami</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, mt: 3, gap: 2 }}>
        <TextField placeholder="Szukaj lokalu..." size="small" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 300, bgcolor: 'white' }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>}} />
        <Button variant="contained" color="warning" startIcon={<StorefrontIcon />} onClick={openCreate}>Dodaj restaurację</Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}><TableRow><TableCell><b>Nazwa</b></TableCell><TableCell><b>E-mail Właściciela</b></TableCell><TableCell><b>Telefon</b></TableCell><TableCell align="right"><b>Akcje</b></TableCell></TableRow></TableHead>
          <TableBody>
            {filteredRestaurants.length === 0 ? <TableRow><TableCell colSpan={4} align="center">Brak wyników</TableCell></TableRow> : filteredRestaurants.map((rest) => (
              <TableRow key={rest.id} hover>
                <TableCell>{rest.name}</TableCell><TableCell>{rest.ownerEmail}</TableCell><TableCell>{rest.phoneNumber}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Usuń restaurację"><IconButton color="error" onClick={() => handleDelete(rest.id)} sx={{ mr: 1 }}><DeleteIcon /></IconButton></Tooltip>
                  <Tooltip title="Edytuj dane i przypisanie"><IconButton color="primary" onClick={() => openEdit(rest)}><EditIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">{isEditing ? 'Edytuj Restaurację' : 'Dodaj nową Restaurację'}</DialogTitle>
        <DialogContent dividers>
          {status.message && <Alert severity={status.type as any} sx={{ mb: 2 }}>{status.message}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Przypisanie</Typography>
            <Autocomplete options={owners} getOptionLabel={(option) => `${option.fullName} (${option.email})`} isOptionEqualToValue={(option, value) => option.email === value.email} value={owners.find(o => o.email === form.ownerEmail) || null} onChange={(event, newValue) => setForm({ ...form, ownerEmail: newValue ? newValue.email : '' })} renderInput={(params) => <TextField {...params} label="Właściciel" required />} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">Dane ogólne</Typography>
            <TextField label="Nazwa" value={form.name} onChange={e => setForm({...form, name: e.target.value})} fullWidth />
            <TextField label="Telefon" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} fullWidth />
            <TextField label="Opis" multiline rows={2} value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} fullWidth />
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">Adres lokalu</Typography>
            <TextField label="Miasto" required value={form.addressCity} onChange={e => setForm({...form, addressCity: e.target.value})} fullWidth />
            <TextField label="Ulica" required value={form.addressStreet} onChange={e => setForm({...form, addressStreet: e.target.value})} fullWidth />
            <Box sx={{ display: 'flex', gap: 2 }}><TextField label="Nr budynku" type="number" required value={form.addressBuilding} onChange={e => setForm({...form, addressBuilding: e.target.value})} fullWidth /><TextField label="Nr lokalu" type="number" value={form.addressAppartment} onChange={e => setForm({...form, addressAppartment: e.target.value})} fullWidth /></Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setOpenModal(false)}>Anuluj</Button><Button variant="contained" color="warning" onClick={handleSave}>{isEditing ? 'Zapisz zmiany' : 'Stwórz restaurację'}</Button></DialogActions>
      </Dialog>
    </Box>
  );
}