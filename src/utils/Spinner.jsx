import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";

export default function OverlaySpinner({ open }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
