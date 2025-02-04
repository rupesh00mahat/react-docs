import {
  Box,
  Container,
  Divider,
  List,
  ListItemButton,
  Button,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCircle from "@mui/icons-material/AddCircle";
import { v4 as uuidv4 } from "uuid";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/configuration";
import { updateDocs } from "../../store/actions";
import { useNavigate } from "react-router";
function Homepage() {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.emailId);
  const documents = useSelector((state) => state.documents);
  const [documentList, setDocumentList] = useState([]);
  const uid = useSelector((state) => state.uid);
  const navigate = useNavigate();

  useEffect(() => {
    setDocumentList(documents);
  }, [documents]);

  const createNewDoc = async () => {
    try {
      let newId = uuidv4();
      const docRef = doc(db, "documents", newId);
      const userDocRef = doc(db, "users", uid);
      await setDoc(docRef, {
        id: newId,
        title: "Untitled Document",
        content: "",
        users: [uid],
      }).then(() => {
        console.log("success");
      });
      await updateDoc(userDocRef, {
        documents: arrayUnion({ id: newId, name: "Untitled Document" }),
      }).then(async () => {
        const updatedDoc = await getDoc(userDocRef);
        console.log(updatedDoc.data());
        dispatch(updateDocs(updatedDoc.data()?.documents));
        alert("New document created successfully");
      });
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: "rgb(241,243,244)", py: 4 }}>
        <Container>
          <Typography fontWeight={300} fontSize={"22px"}>
            Start a new document
          </Typography>
          <Box
            sx={{
              background: "#fff",
              height: " 250px",
              width: "200px",
              margin: "10px 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={createNewDoc} sx={{ p: 0 }}>
              <AddCircle sx={{ height: "50px", width: "50px" }} />
            </Button>
          </Box>
        </Container>
      </Box>
      <Divider />

      <Container>
        <Typography
          sx={{ padding: "15px 0" }}
          variant="h4"
          fontSize={"32px"}
          fontWeight={400}
        >
          Your Documents
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <List>
            {documentList &&
              documentList.map((document) => {
                return (
                  <ListItemButton
                    onClick={() => {
                      navigate(`/document/${document.id}`);
                    }}
                    key={document.id}
                    sx={{
                      borderBottom: "2px solid #e4e4e4",
                      p: "13px",
                      fontSize: "24px",
                      fontWeight: 400,
                    }}
                  >
                    {document.name}
                  </ListItemButton>
                );
              })}
          </List>
        </Box>
      </Container>
    </>
  );
}

export default Homepage;
