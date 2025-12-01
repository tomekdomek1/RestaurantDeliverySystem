import React from "react";
import { Container, Tabs, Tab, Box } from "@mui/material";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import CategoriesPage from "./components/CategoriesPage";

const App: React.FC = () => {
  const [tab, setTab] = React.useState(0);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
          <Tab label="Login" />
          <Tab label="Register" />
          <Tab label="Categories" />
        </Tabs>
        {tab === 0 && <LoginForm />}
        {tab === 1 && <RegistrationForm/>}
        {tab === 2 && <CategoriesPage/>}
      </Box>
    </Container>
  );
};

export default App;
