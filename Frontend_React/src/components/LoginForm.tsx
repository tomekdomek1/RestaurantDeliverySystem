import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, InputAdornment, Fade } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/restaurants");
      } else {
        alert("Nieprawidłowe dane logowania");
      }
    } catch {
      navigate("/restaurants");
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Paper 
        elevation={12} 
        sx={{ 
          display: 'flex', 
          maxWidth: 1000, 
          mx: "auto", 
          mt: 8, 
          borderRadius: 4, 
          overflow: 'hidden', 
          minHeight: 600 
        }}
      >
        <Box 
          sx={{ 
            flex: 1.2, 
            display: { xs: 'none', md: 'block' }, 
            backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            position: 'relative', 
            '&::after': { 
              content: '""', 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))' 
            } 
          }}
        >
          <Box sx={{ position: 'absolute', bottom: 40, left: 40, color: 'white', zIndex: 1 }}>
            <Typography variant="h3" fontWeight="900" gutterBottom>
              Smakuj życie.
            </Typography>
            <Typography variant="h6" fontWeight="400">
              Najlepsze restauracje w Twojej okolicy.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: '#ff5252' }}>
            <RestaurantIcon fontSize="large" sx={{ mr: 1.5 }} />
            <Typography variant="h5" fontWeight="900" letterSpacing={1}>
              UBEREATS CLONE
            </Typography>
          </Box>
          
          <Typography variant="h4" fontWeight="800" gutterBottom>
            Witaj z powrotem
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField 
              fullWidth 
              label="Email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              margin="normal" 
              InputProps={{ 
                startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>), 
                sx: { borderRadius: 2 } 
              }} 
            />
            <TextField 
              fullWidth 
              label="Hasło" 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              margin="normal" 
              InputProps={{ 
                startAdornment: (<InputAdornment position="start"><LockIcon color="action" /></InputAdornment>), 
                sx: { borderRadius: 2 } 
              }} 
            />
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              size="large" 
              sx={{ 
                mt: 4, 
                mb: 3, 
                py: 1.8, 
                borderRadius: 2, 
                fontWeight: 'bold', 
                background: 'linear-gradient(45deg, #ff5252 30%, #ff1744 90%)' 
              }}
            >
              Zaloguj się
            </Button>
            <Typography align="center">
              Nie masz konta? <Link to="/register" style={{ color: '#ff5252', fontWeight: 'bold', textDecoration: 'none' }}>Zarejestruj się</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
}