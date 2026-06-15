import { Box, Typography, Container, Paper, Divider, Chip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default function AboutPage() {
  const technologies = [
    'React', 'TypeScript', 'Material-UI', '.NET 8', 'C#', 
    'Entity Framework', 'CQRS (MediatR)', 'SQLite', 'JWT Auth'
  ];

  return (
    <Box sx={{ pb: 10 }}>
      <Container maxWidth="lg">
        {/* Sekcja Główna (Hero) */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          px: 2,
          mb: 6, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <Typography 
            variant="h2" 
            fontWeight="900" 
            sx={{ 
              background: '-webkit-linear-gradient(45deg, #06C167, #1976d2)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }} 
            gutterBottom
          >
            O Projekcie
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.8, fontWeight: 400 }}
          >
            Nowoczesny system do zamawiania jedzenia online, inspirowany platformą UberEats. 
            Zaprojektowany z naciskiem na czystą architekturę, bezpieczeństwo i doskonałe 
            doświadczenie użytkownika.
          </Typography>
        </Box>

        {/* Sekcja Cech Projektu - Zamieniono Grid na bezpieczny Box display: grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4, 
          mb: 8 
        }}>
          {/* Karta 1 */}
          <Paper elevation={0} sx={{ 
            height: '100%', p: 4, borderRadius: 4, border: '1px solid #eaeaea', 
            transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', 
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)', borderColor: '#1976d2' } 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: '50%', display: 'flex' }}>
                <RestaurantMenuIcon sx={{ fontSize: 40, color: '#1976d2' }} />
              </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
              Czysta Architektura
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ lineHeight: 1.7 }}>
              Wzorzec Clean Architecture oraz CQRS. Oddzielenie logiki biznesowej 
              od infrastruktury gwarantuje łatwą rozbudowę i niezawodność.
            </Typography>
          </Paper>

          {/* Karta 2 */}
          <Paper elevation={0} sx={{ 
            height: '100%', p: 4, borderRadius: 4, border: '1px solid #eaeaea', 
            transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', 
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)', borderColor: '#2e7d32' } 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: '50%', display: 'flex' }}>
                <SecurityIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
              </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
              Bezpieczeństwo
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ lineHeight: 1.7 }}>
              Zaawansowana autoryzacja JWT. Role systemowe precyzyjnie chronią 
              panele administracyjne i prywatne dane użytkowników.
            </Typography>
          </Paper>

          {/* Karta 3 */}
          <Paper elevation={0} sx={{ 
            height: '100%', p: 4, borderRadius: 4, border: '1px solid #eaeaea', 
            transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', 
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)', borderColor: '#ed6c02' } 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ bgcolor: '#fff3e0', p: 2, borderRadius: '50%', display: 'flex' }}>
                <SpeedIcon sx={{ fontSize: 40, color: '#ed6c02' }} />
              </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
              Nowoczesny UI/UX
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ lineHeight: 1.7 }}>
              Interfejs zaprojektowany w Material-UI. Jest w pełni responsywny, szybki 
              i intuicyjny, idealnie działający na każdym urządzeniu.
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ mb: 8, mx: 'auto', width: '60%' }} />

        {/* Sekcja Technologii */}
        <Box sx={{ 
          textAlign: 'center', bgcolor: '#ffffff', p: 6, borderRadius: 4, 
          border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' 
        }}>
          <Typography variant="h4" fontWeight="800" gutterBottom sx={{ mb: 2 }}>
            Stack Technologiczny
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 5, maxWidth: '600px', mx: 'auto' }}>
            Wykorzystano najnowsze i najbardziej stabilne narzędzia, aby zapewnić 
            najwyższą jakość kodu na backendzie i frontendzie.
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {technologies.map((tech) => (
              <Chip 
                key={tech} 
                label={tech} 
                icon={tech.includes('React') || tech.includes('UI') ? <CodeIcon /> : <StorageIcon />}
                variant="outlined"
                sx={{ 
                  fontSize: '1.1rem', py: 3, px: 2, borderRadius: '16px', borderWidth: 2,
                  borderColor: '#e0e0e0', color: '#333', fontWeight: 600,
                  transition: 'all 0.2s', '&:hover': {
                    borderColor: '#06C167', backgroundColor: 'rgba(6, 193, 103, 0.05)', 
                    transform: 'scale(1.05)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}