import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useSnackbar } from "notistack"; // Import biblioteki powiadomień

const LoginForm: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar(); // Inicjalizacja toastów
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Zmieniono port na 5122, aby pasował do Twojego działającego Backendu
      const response = await fetch("http://localhost:5122/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        
        // Wyświetlenie zielonego powiadomienia zamiast alertu
        enqueueSnackbar("Login successful! Welcome back.", { variant: "success" });
      } else {
        const errorMsg = "Invalid email or password";
        setError(errorMsg);
        // Wyświetlenie czerwonego powiadomienia
        enqueueSnackbar(errorMsg, { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      const catchMsg = "Something went wrong. Please try again later.";
      setError(catchMsg);
      enqueueSnackbar(catchMsg, { variant: "error" });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        {error && (
          <Typography color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;