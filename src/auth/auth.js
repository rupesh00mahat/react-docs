import {
  auth,
  googleProvider,
  signInWithPopup,
} from "../firebase/configuration";
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("user", result.user);
    return result.user;
  } catch (error) {
    console.error("Google Sign In Error:", error);
    throw error;
  }
};
