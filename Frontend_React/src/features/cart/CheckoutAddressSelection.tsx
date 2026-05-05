import { Box, Typography, Card, CardContent, CircularProgress, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import type { GetAddressResponseDto } from "../address/types/addressDtos";

interface Props {
  addresses: GetAddressResponseDto[];
  isLoading: boolean;
  error: any;
  selectedAddress: string;
  setSelectedAddress: (val: string) => void;
}

export default function CheckoutAddressSelection({ addresses, isLoading, error, selectedAddress, setSelectedAddress }: Props) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Wybierz adres dostawy</Typography>
      {isLoading ? <CircularProgress /> : error ? <Typography color="error">Błąd adresów</Typography> : (
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <RadioGroup value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
              {addresses.map((addr) => (
                <Box key={addr.id} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 2, '&:hover': { bgcolor: '#f5f5f5' } }}>
                  <FormControlLabel 
                    value={addr.id} 
                    control={<Radio />} 
                    label={<Box><Typography sx={{ fontWeight: 600 }}>{addr.street} {addr.buildingNumber}</Typography><Typography variant="body2">{addr.city}</Typography></Box>} 
                    sx={{ width: '100%', m: 0 }}
                  />
                </Box>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}