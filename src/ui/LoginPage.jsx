import React from "react";
import { signInWithGoogle } from "../auth/auth";
import { Box, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { initiateData, loginuser } from "../store/actions";
import { useNavigate } from "react-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/configuration";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignIn = async () => {
    let user = await signInWithGoogle();
    dispatch(loginuser({ email: user.email, uid: user.uid }));
    if (user.email) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          console.log("does not exits");
          await setDoc(userDocRef, {
            email: user.email,
            uid: user.uid,
            documents: [],
          });
          dispatch(
            initiateData({
              documents: [],
              email: userDocSnap.data().email,
              userId: userDocSnap.data(),
            })
          );
        } else {
          console.log("userDocSnap", userDocSnap.data());
          console.log("exists");
          dispatch(
            initiateData({
              documents: userDocSnap.data().documents,
              email: userDocSnap.data().email,
              userId: userDocSnap.data(),
            })
          );
        }
      } catch (error) {
        console.log("GETDocError: ", error);
      }
      navigate("/");
    }
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
