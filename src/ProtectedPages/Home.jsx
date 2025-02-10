import React from "react";
import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Welcome to Dashboard
      </Typography>
    </Box>
  );
};

export default Home;
