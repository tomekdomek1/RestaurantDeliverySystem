import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, Fade, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!email.includes('@')) newErrors.push("Podaj poprawny adres email.");
    if (fullName.trim().length < 3) newErrors.push("Imię i nazwisko musi mieć co najmniej 3 znaki.");
    if (password.length < 6) newErrors.push("Hasło musi mieć co najmniej 6 znaków.");
    if (!/(?=.*[A-Z])/.test(password)) newErrors.push("Hasło musi zawierać co najmniej jedną wielką literę.");
    if (!/(?=.*[a-z])/.test(password)) newErrors.push("Hasło musi zawierać co najmniej jedną małą literę.");
    if (!/(?=.*[0-9])/.test(password)) newErrors.push("Hasło musi zawierać co najmniej jedną cyfrę.");
    if (!/(?=.*[!@#$%^&*])/.test(password)) newErrors.push("Hasło musi zawierać co najmniej jeden znak specjalny (!@#$%^&*).");
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      const response = await fetch('http://localhost:5122/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // Sprawdźmy co wypluwa backend .NET Identity
        if (errorData && Array.isArray(errorData)) {
            setErrors(errorData.map((e: any) => e.description || "Błąd walidacji"));
        } else {
            setErrors(["Użytkownik o podanym adresie email może już istnieć lub podano błędne dane."]);
        }
        return;
      }
      navigate('/login');
    } catch (err) {
      setErrors(["Wystąpił problem z połączeniem z serwerem."]);
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 450, bgcolor: 'background.paper' }}>
          <Typography variant="h4" gutterBottom align="center" color="primary.main" fontWeight="bold">
            Rejestracja
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 3 }} color="text.secondary">
            Zarejestruj się w UberEats i zamawiaj co tylko zechcesz!
          </Typography>
          
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Imię i nazwisko" margin="normal" variant="outlined" value={fullName} onChange={e => setFullName(e.target.value)} required />
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
            <Button fullWidth type="submit" variant="contained" color="primary" size="large" sx={{ mt: 4, mb: 3 }}>
              Zarejestruj się
            </Button>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Masz już konto? <Link to="/login" style={{ color: '#4caf50', textDecoration: 'none', fontWeight: 'bold' }}>Zaloguj się</Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
}