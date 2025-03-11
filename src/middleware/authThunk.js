import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithGoogle } from "../auth/auth";
import { initiateData, loginuser } from "../store/actions";
import { db } from "../firebase/configuration";

export const signInFromEmail = () => {
  return async (dispatch) => {
    let user = await signInWithGoogle();
    dispatch(loginuser({ email: user.email, uid: user.uid }));
    if (user.email) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            console.log('userDocSnap',userDocSnap.data());
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
    }
  };
};
