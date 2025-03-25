import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithGoogle } from "../auth/auth";
import { initiateData, loginuser } from "../store/actions";
import { auth, db } from "../firebase/configuration";
import { signInWithEmailAndPassword } from "firebase/auth";

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
              userId: userDocSnap.data()?.uid,
            })
          );
        } else {
          console.log('userDpcSnap.data', userDocSnap.data());
          const sharedDocs =  userDocSnap.data().shared ? userDocSnap.data().shared: []
          dispatch(
            initiateData({
              documents: [...userDocSnap.data().documents,sharedDocs],
              email: userDocSnap.data().email,
              userId: userDocSnap.data()?.uid,
            })
          );
        }
      } catch (error) {
        console.log("GETDocError: ", error);
      }
    }
  };
};


export const signIn = (userName, password) => {
 return async (dispatch) => {
  try{
    await signInWithEmailAndPassword(auth, userName, password).then(async(userCredentials)=> {
      const user = userCredentials.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      dispatch(loginuser({email: userDocSnap.data()?.email,uid: userDocSnap.data()?.uid}))
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          uid: user.uid,
          documents: [],
        });
        dispatch(
          initiateData({
            documents: [],
            email: userDocSnap.data().email,
            userId: userDocSnap.data()?.uid,
          })
        );
      } else {
        console.log('userDocSnap',userDocSnap.data());

        dispatch(
          initiateData({
            documents: [...userDocSnap.data().documents, ...userDocSnap.data().shared],
          })
        );
      }
    })
  }catch(e){
    console.log('e.message', e.message);
  }
 }
}