import React from "react";
import { Box, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { signInFromEmail } from "../middleware/authThunk";

 function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignIn = async () => {
    await dispatch(signInFromEmail());
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        sx={{
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "500",
          letterSpacing: "0.2px",
          p: "12px 24px",
        }}
        onClick={handleSignIn}
        size="large"
        variant="contained"
      >
        Sign In
      </Button>
    </Box>
  );
}

export default LoginPage;
