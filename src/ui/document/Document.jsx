import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Box, Button } from "@mui/material";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/configuration";
import { useDispatch, useSelector } from "react-redux";
import { updateDocs } from "../../store/actions";

function Document() {
  const [content, setContent] = useState("");
  const { id } = useParams();
  const docRef = doc(db, "documents", id);
  const documents = useSelector((state) => state.documents);
  const uid = useSelector((state) => state.uid);
  const userDocRef = doc(db, "users", uid);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadContent = async () => {
      await getDoc(docRef).then((value) => {
        setContent(value.data()?.content);
      });
    };
    loadContent();
  }, []);

  const handleChange = (value) => {
    setContent(value);
  };
  const updateDocument = async () => {
    await updateDoc(docRef, {
      content: content,
    }).then(() => {
      alert("Saved");
    });
  };

  const removeDoc = async () => {
    await deleteDoc(docRef).then(async () => {
      let newId = id;
      const newDoc = documents?.filter(({ id }) => {
        return newId !== id;
      });

      await updateDoc(userDocRef, { documents: newDoc });
      dispatch(updateDocs(newDoc));
      navigate("/");
    });
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          sx={{ m: 2 }}
          variant="contained"
          onClick={() => {
            updateDocument();
          }}
        >
          Save
        </Button>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          onClick={() => {
            removeDoc();
          }}
        >
          Delete
        </Button>
      </Box>
      <ReactQuill value={content} onChange={handleChange} theme="snow" />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default Document;
