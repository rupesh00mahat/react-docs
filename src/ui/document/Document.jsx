import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "react-quill/dist/quill.snow.css";
import { Box, Button, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/configuration";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDocument,
  updateDocsContent,
} from "../../middleware/postInteractionThunk";
import { io } from "socket.io-client";
import Quill from "quill";

function Document() {
  const [content, setContent] = useState(null);
  const { id } = useParams();
  const docRef = doc(db, "documents", id);
  const uid = useSelector((state) => state.uid);
  const email = useSelector((state) => state.emailId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [activeCollaborators, updateActiveCollaborators] = useState([]);
  const [saved, setSaveState] = useState(true);
  const saveRef = useRef(null);
  const [quill, setQuill] = useState(null);

  console.log('Active Collaborators', activeCollaborators);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(email, ' to be sent');

    if (id && socket && email) {
      socket.emit("join-room", id, email);
    }
    return () => {
      if(socket){
        socket.off("join-room");
        
      }
    };
  }, [id, socket]);

  
  useEffect(() => {
    if (!socket || !quill) return;
    const handleTextChange = (delta,oldDelta, source) => {
      if (source == "user") {
        // setSaveState(false);
        updateDocument();
        socket.emit("send-changes", { roomId: id, delta });
      }
    };
    quill.on("text-change", handleTextChange);
    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [socket, quill]);

  useEffect(() => {
    console.log(socket);
    if (!socket) return;

    socket.on("receive-changes", (delta) => {
      
      quill.updateContents(delta);
    });
    socket.on('new-user', (userId)=> {
      console.log(userId);
      updateActiveCollaborators(userId )
     
    })
    socket.on('user-left', (email) => {
      console.log(email,'left');
    })
  }, [socket]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!saveRef.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      await getDoc(docRef).then((value) => {
        const authorizedUsers = value
          .data()
          ?.users.map((id) => id.replace(/"/g, ""));
        authorizedUsers.includes(uid)
          ? setContent(value.data()?.content)
          : navigate("/");
      });
    };
    loadContent();
  }, []);

  useEffect(()=>{
    if (!quill || !content) return;
    quill.updateContents(content);
  },[content])

  const updateDocument = () => {
    try {
      dispatch(updateDocsContent(id, JSON.parse(JSON.stringify(quill.getContents()))));
      setSaveState(true);
    } catch (e) {
      console.log("e.message", e.message);
    }
  };

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic"],
          ["link", "image"],
        ],
      },
    });
    setQuill(q);
  }, []);

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
        <Typography variant="span">Active Collaborators: {activeCollaborators.map(({email})=> email +' , ')}  </Typography>
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
      <div className="container" ref={wrapperRef}></div>
    </div>
  );
}

export default Document;
