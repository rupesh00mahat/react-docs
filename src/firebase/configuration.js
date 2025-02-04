import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyASi_9m_sZPwiHpAROUeeXButZF8iSSeJs",
  authDomain: "react-docs-6618e.firebaseapp.com",
  projectId: "react-docs-6618e",
  storageBucket: "react-docs-6618e.firebasestorage.app",
  messagingSenderId: "678663449035",
  appId: "1:678663449035:web:31cb171767dfc5dcefee4e",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, signInWithPopup, signOut, db };
