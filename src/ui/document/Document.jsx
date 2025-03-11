import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Box, Button } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/configuration";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDocument,
  updateDocsContent,
} from "../../middleware/postInteractionThunk";

function Document() {
  const [content, setContent] = useState("");
  const { id } = useParams();
  const docRef = doc(db, "documents", id);
  const uid = useSelector((state) => state.uid);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saved, setSaveState] = useState(true);
  const saveRef = useRef(null);

  useEffect(() => {
    const handlePopState = () => {
      if (!saveRef.current) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    const handleBeforeUnload = (event) => {
      if (!saveRef.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    saveRef.current = saved;
    if (!saved) {
      window.addEventListener(
        "popstate",
        window.history.pushState(null, "".window.location.href)
      );
    }
  }, [saved]);

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
    setSaveState(false);
  };
  const updateDocument = () => {
    try {
      dispatch(updateDocsContent(id));
      setSaveState(true);
    } catch (e) {
      console.log("e.message", e.message);
    }
  };

  const removeDoc = () => {
    try {
      dispatch(deleteDocument(id, uid));
      navigate("/");
    } catch (e) {}
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
