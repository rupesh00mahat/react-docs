import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { signIn, signInFromEmail } from "../middleware/authThunk";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassWord] = useState("");

  const handleSignIn = async () => {
    await dispatch(signInFromEmail());
    navigate("/");
  };

  const handleLogin = async () => {
      dispatch(signIn(userName, password))
      navigate('/');
  }

  return (
    <>
    
      <Box
        sx={{
          height: "100vh",
          margin: "auto",
          display: "flex",
          flexDirection: 'column',
          justifyContent: "center",
          alignItems: "center",
          gap: 2
        }}
      >
         <TextField
         placeholder="Enter UserName"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <TextField
        placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassWord(e.target.value);
          }}
        />
        <Button 
        
        size="large"
        onClick={handleLogin} variant="contained">Sign In</Button>
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
          Sign In With Email
        </Button>
      </Box>
    </>
  );
}

export default LoginPage;
