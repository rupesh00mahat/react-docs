import { arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateDocs } from "../store/actions";
import { db } from "../firebase/configuration";

export const createNewDocument = (docId, uid) => {
  return async (dispatch) => {
    try {
      const docRef = doc(db, "documents", docId);
      const userDocRef = doc(db, "users", uid);
      await setDoc(docRef, {
        id: docId,
        title: "Untitled Document",
        content: "",
        users: [uid],
      }).then(() => {
        console.log("success");
      });
      await updateDoc(userDocRef, {
        documents: arrayUnion({ id: docId, name: "Untitled Document" }),
      }).then(async () => {
        const updatedDoc = await getDoc(userDocRef);
        dispatch(updateDocs(updatedDoc.data()?.documents));
        alert("New document created successfully");
      });
    } catch (error) {
      console.log("Error:", error.message);
    }
  };
};

export const renameDocument = (docId, newName, uid) => {
  return async (dispatch) => {
    try {
      const docRef = doc(db, 'documents', docId); 
    await updateDoc(docRef,{
      title: newName
    })  
    const userRef = doc(db,'users', uid );
    const  userDocSnap = await getDoc(userRef);
    if(userDocSnap.exists()){
      const documents = userDocSnap.data().documents;
      const selectedDocument = documents.filter((document)=> document.id == docId);
      const remainingDocument = documents.filter((document) => document.id !== docId);
      selectedDocument[0].name = newName;
    
      console.log('documents', userDocSnap.data())
      await updateDoc(userRef, {
      documents: [...remainingDocument, ...selectedDocument]
      })
      dispatch(updateDocs([...selectedDocument,...remainingDocument]))
    }
    } catch (e) {
      console.log('Err'+ e.message);
    }
  };
};
export const deleteDocument = (docId, uid) => {
  return async (dispatch) => {
    try {
      const docRef = doc(db, 'documents', docId); 
    await deleteDoc(docRef)  
    const userRef = doc(db,'users', uid );
    const  userDocSnap = await getDoc(userRef);
    if(userDocSnap.exists()){
      const documents = userDocSnap.data().documents;
      const remainingDocument = documents.filter((document) => document.id !== docId);
    
      await updateDoc(userRef, {
      documents: [...remainingDocument]
      })
      dispatch(updateDocs([...remainingDocument]))
    }
    } catch (e) {
      console.log('Err'+ e.message);
    }
  };
};

export const updateDocsContent = (docId) => {
  return async (dispatch) => {
    try{
      const docRef = doc(db, 'documents', docId);
      await updateDoc(docRef,{
        content: content,
      }).then(()=> {
        alert('Saved');
      })
    }catch(e){

    }
  }

}
