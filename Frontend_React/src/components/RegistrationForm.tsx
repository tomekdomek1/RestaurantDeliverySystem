import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, InputAdornment, Fade, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", role: "Customer" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        alert("Błąd podczas rejestracji");
      }
    } catch {
      navigate("/login");
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Paper elevation={12} sx={{ display: 'flex', maxWidth: 1000, mx: "auto", mt: 8, borderRadius: 4, overflow: 'hidden', minHeight: 600 }}>
        <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: '#1a237e' }}>
            <RestaurantIcon fontSize="large" sx={{ mr: 1.5 }} />
            <Typography variant="h5" fontWeight="900">DOŁĄCZ DO NAS</Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Imię i Nazwisko" name="fullName" value={formData.fullName} onChange={handleChange} margin="dense" InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>), sx: { borderRadius: 2 } }} />
            <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="dense" InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>), sx: { borderRadius: 2 } }} />
            <TextField fullWidth label="Hasło" name="password" type="password" value={formData.password} onChange={handleChange} margin="dense" InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon color="action" /></InputAdornment>), sx: { borderRadius: 2 } }} />
            
            <FormControl component="fieldset" sx={{ mt: 2, mb: 1 }}>
              <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Typ konta</FormLabel>
              <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
                <FormControlLabel value="Customer" control={<Radio color="primary" />} label="Klient" />
                <FormControlLabel value="RestaurantOwner" control={<Radio color="secondary" />} label="Restaurator" />
              </RadioGroup>
            </FormControl>
            
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold', background: 'linear-gradient(45deg, #1a237e 30%, #303f9f 90%)' }}>
              Zarejestruj się
            </Button>
            <Typography align="center" variant="body2">Masz już konto? <Link to="/login" style={{ color: '#1a237e', fontWeight: 'bold', textDecoration: 'none' }}>Zaloguj się</Link></Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1.2, display: { xs: 'none', md: 'block' }, backgroundImage: 'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </Paper>
    </Fade>
  );
}