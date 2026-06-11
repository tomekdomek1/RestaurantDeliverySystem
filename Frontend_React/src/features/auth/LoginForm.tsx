import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, Fade, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from './hooks/useAuth';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError("Nieprawidłowy adres email lub hasło.");
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h4" gutterBottom align="center" color="primary.main" fontWeight="bold">
            Logowanie
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 3 }} color="text.secondary">
            Witaj ponownie! Zaloguj się, aby kontynuować.
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" type="email" margin="normal" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} required />
            <TextField fullWidth label="Hasło" type={showPassword ? 'text' : 'password'} margin="normal" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth type="submit" variant="contained" color="primary" size="large" sx={{ mt: 4, mb: 3, py: 1.5 }}>
              Zaloguj się
            </Button>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Nie masz konta? <Link to="/register" style={{ color: '#4caf50', textDecoration: 'none', fontWeight: 'bold' }}>Zarejestruj się</Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
}