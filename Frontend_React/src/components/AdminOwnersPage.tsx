import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, IconButton, Tooltip, InputAdornment 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { API_BASE_URL } from '../config/api';

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<any[]>([]); 
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => { fetchOwners(); }, []);

  const fetchOwners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/owners`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }});
      if (response.ok) setOwners(await response.json());
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    setStatus({ type: '', message: '' });
    try {
      if (isEditing) {
        const response = await fetch(`${API_BASE_URL}/api/auth/staff/${form.email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
          body: JSON.stringify({ fullName: form.fullName, password: form.password || null })
        });
        if (!response.ok) throw new Error('Błąd aktualizacji konta.');
      } else {
        const response = await fetch(`${API_BASE_URL}/api/auth/register-staff`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
          body: JSON.stringify({ email: form.email, password: form.password, fullName: form.fullName, role: 'RestaurantOwner' })
        });
        if (!response.ok) throw new Error('Błąd tworzenia konta.');
      }
      fetchOwners();
      setOpenModal(false);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
  };

  const handleDelete = async (email: string) => {
    if (!window.confirm(`UWAGA! Usuwasz właściciela ${email} ORAZ JEGO RESTAURACJE. Kontynuować?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/restaurants`);
      if (res.ok) {
        const data = await res.json();
        const ownerRests = data.filter((r: any) => r.descrition?.includes(`[OWNER:${email}]`));
        for (const rest of ownerRests) {
          await fetch(`${API_BASE_URL}/api/restaurants/${rest.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }});
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/auth/staff/${email}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }});
      if (!response.ok) throw new Error('Błąd usuwania konta.');
      fetchOwners();
    } catch (err: any) { alert(`Błąd: ${err.message}`); }
  };

  const filteredOwners = owners.filter(o => (o.fullName?.toLowerCase() || '').includes(search.toLowerCase()) || (o.email?.toLowerCase() || '').includes(search.toLowerCase()));

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Zarządzanie Właścicielami</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, mt: 3, gap: 2 }}>
        <TextField placeholder="Szukaj właściciela..." size="small" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 300, bgcolor: 'white' }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>}} />
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => { setIsEditing(false); setForm({email:'', password:'', fullName:''}); setStatus({type:'', message:''}); setOpenModal(true); }}>Dodaj nowe konto</Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}><TableRow><TableCell><b>Dane Właściciela</b></TableCell><TableCell align="right"><b>Akcje</b></TableCell></TableRow></TableHead>
          <TableBody>
            {filteredOwners.map((owner, i) => (
              <TableRow key={i} hover>
                <TableCell><Typography fontWeight="bold">{owner.fullName || "Restaurator"}</Typography><Typography variant="body2" color="text.secondary">{owner.email}</Typography></TableCell>
                <TableCell align="right">
                  <Tooltip title="Usuń właściciela"><IconButton color="error" onClick={() => handleDelete(owner.email)} sx={{ mr: 1 }}><DeleteIcon /></IconButton></Tooltip>
                  <Tooltip title="Edytuj dane"><IconButton color="primary" onClick={() => { setIsEditing(true); setForm({ email: owner.email, password: '', fullName: owner.fullName }); setStatus({type:'', message:''}); setOpenModal(true); }}><EditIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">{isEditing ? 'Edytuj konto' : 'Załóż konto'}</DialogTitle>
        <DialogContent dividers>
          {status.message && <Alert severity={status.type as any} sx={{ mb: 2 }}>{status.message}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Imię i nazwisko" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} fullWidth />
            <TextField label="Adres e-mail (Login)" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled={isEditing} fullWidth />
            <TextField label={isEditing ? "Nowe hasło (puste=bez zmian)" : "Hasło"} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setOpenModal(false)}>Anuluj</Button><Button variant="contained" onClick={handleSave}>{isEditing ? 'Zapisz zmiany' : 'Załóż konto'}</Button></DialogActions>
      </Dialog>
    </Box>
  );
}