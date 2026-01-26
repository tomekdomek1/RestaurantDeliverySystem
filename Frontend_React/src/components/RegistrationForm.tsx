import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useSnackbar } from "notistack"; 

const RegistrationForm: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar(); 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      enqueueSnackbar("Please fix the errors in the form.", { variant: "warning" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5122/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        enqueueSnackbar("Registration successful! You can now log in.", { variant: "success" });
        // Możesz tutaj wyczyścić formularz
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
      } else {
        enqueueSnackbar("Registration failed. Email might be already taken.", { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("Could not connect to the server.", { variant: "error" });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Create Account
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Box>
    </Paper>
  );
};

export default RegistrationForm;