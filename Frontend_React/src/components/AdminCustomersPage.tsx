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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]); 
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/customers`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }});
      if (response.ok) setCustomers(await response.json());
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
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password, fullName: form.fullName })
        });
        if (!response.ok) throw new Error('Błąd tworzenia konta.');
      }
      fetchCustomers();
      setOpenModal(false);
    } catch (err: any) { setStatus({ type: 'error', message: err.message }); }
  };

  const handleDelete = async (email: string) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć klienta ${email}? Tej operacji nie można cofnąć.`)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/staff/${email}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }});
      if (!response.ok) throw new Error('Nie można usunąć klienta. Prawdopodobnie ma przypisane aktywne zamówienia w bazie danych.');
      fetchCustomers();
    } catch (err: any) { alert(`Błąd: ${err.message}`); }
  };

  const filteredCustomers = customers.filter(c => (c.fullName?.toLowerCase() || '').includes(search.toLowerCase()) || (c.email?.toLowerCase() || '').includes(search.toLowerCase()));

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Zarządzanie Klientami</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, mt: 3, gap: 2 }}>
        <TextField placeholder="Szukaj klienta..." size="small" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 300, bgcolor: 'white' }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>}} />
        <Button variant="contained" color="success" startIcon={<PersonAddIcon />} onClick={() => { setIsEditing(false); setForm({email:'', password:'', fullName:''}); setStatus({type:'', message:''}); setOpenModal(true); }}>Zarejestruj Klienta</Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}><TableRow><TableCell><b>Dane Klienta</b></TableCell><TableCell align="right"><b>Akcje</b></TableCell></TableRow></TableHead>
          <TableBody>
            {filteredCustomers.length === 0 ? <TableRow><TableCell colSpan={2} align="center">Brak wyników</TableCell></TableRow> : filteredCustomers.map((customer, i) => (
              <TableRow key={i} hover>
                <TableCell><Typography fontWeight="bold">{customer.fullName || "Klient"}</Typography><Typography variant="body2" color="text.secondary">{customer.email}</Typography></TableCell>
                <TableCell align="right">
                  <Tooltip title="Usuń klienta"><IconButton color="error" onClick={() => handleDelete(customer.email)} sx={{ mr: 1 }}><DeleteIcon /></IconButton></Tooltip>
                  <Tooltip title="Edytuj dane"><IconButton color="primary" onClick={() => { setIsEditing(true); setForm({ email: customer.email, password: '', fullName: customer.fullName }); setStatus({type:'', message:''}); setOpenModal(true); }}><EditIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">{isEditing ? 'Edytuj konto Klienta' : 'Zarejestruj Klienta'}</DialogTitle>
        <DialogContent dividers>
          {status.message && <Alert severity={status.type as any} sx={{ mb: 2 }}>{status.message}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Imię i nazwisko" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} fullWidth />
            <TextField label="Adres e-mail (Login)" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled={isEditing} fullWidth />
            <TextField label={isEditing ? "Nowe hasło (puste=bez zmian)" : "Hasło"} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setOpenModal(false)}>Anuluj</Button><Button variant="contained" color="success" onClick={handleSave}>{isEditing ? 'Zapisz zmiany' : 'Załóż konto'}</Button></DialogActions>
      </Dialog>
    </Box>
  );
}