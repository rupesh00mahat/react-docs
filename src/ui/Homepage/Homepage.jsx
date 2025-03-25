import {
  Box,
  Container,
  Divider,
  List,
  ListItemButton,
  Button,
  Typography,
  IconButton,
  Popover,
  Dialog,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCircle from "@mui/icons-material/AddCircle";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { MoreVert } from "@mui/icons-material";
import { createNewDocument, deleteDocument, renameDocument, shareDocToUser } from "../../middleware/postInteractionThunk";
function Homepage() {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.emailId);
  const documents = useSelector((state) => state.documents);
  const [documentList, setDocumentList] = useState([]);
  const uid = useSelector((state) => state.uid);
  const navigate = useNavigate();
  const [newDocName, setDocName] = useState("");
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [sharedUserName, setSharedUserName] = useState('');
  const [selectedDocName, setSelectedDocName] = useState('');
  const state = useSelector((state)=> state);
  console.log('state', state);

  useEffect(() => {
    setDocumentList(documents);
  }, [documents]);

  const createNewDoc = async () => {
    const newId = uuidv4();
    console.log('uid', uid);
    await dispatch(createNewDocument(newId, uid));
  };

  const handleRename = async () => {
     if(selectedDocId !== null){
      console.log('selectedDocId', selectedDocId);
      await dispatch(renameDocument(selectedDocId, newDocName, uid));
      setOpenDialog(false);
      setSelectedDocId(null);
     }
  };
  const removeDocument = async () => {
     if(selectedDocId !== null){
      await dispatch(deleteDocument(selectedDocId, uid));
      setOpenDialog2(false);
      setSelectedDocId(null);
     }
  };

  const shareDocument = async (name) => {
    if(selectedDocId !== null && sharedUserName !== ''){
      await dispatch(shareDocToUser(selectedDocId, sharedUserName, selectedDocName, email));
      setSelectedDocName('');
      setSharedUserName('');
    }
setOpenDialog3(false);
  }

  

  useEffect(()=>{
    let newArr = [];
    documentList.map(()=>{
      newArr.push(null);
    })
    setAnchorEl(newArr);
  },[documentList])

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
        {documentList.length > 0 && (
          <Typography
            sx={{ padding: "15px 0" }}
            variant="h4"
            fontSize={"32px"}
            fontWeight={400}
          >
            Your Documents
          </Typography>
        )}
        {documentList.length == 0 && (
          <Typography fontSize={"20px"} fontWeight={300} sx={{ mt: 2 }}>
            No documents to display.
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <List>
            {documentList &&
              documentList.map((document, index) => {
                const open = Boolean(anchorEl[index]);
                const id = open? 'Simple-popover': undefined;
                return (
                  <Box
                    key={document.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "2px solid #e4e4e4",
                    }}
                  >
                    <ListItemButton
                      onClick={() => {
                        navigate(`/document/${document.id}`);
                      }}
                      key={document.id}
                      sx={{
                        p: "13px",
                        fontSize: "24px",
                        fontWeight: 400,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {document.name}
                    </ListItemButton>
                    <IconButton
                      onClick={(e) => {
                        console.log('Hello');
                        console.log(anchorEl);
                        setAnchorEl((prevState)=> prevState.map((state, index2)=> index == index2 ? e.currentTarget:state ));
                      }}
                      aria-describedby={id}
                    >
                      <MoreVert />
                    </IconButton>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl[index]}
                      onClose={() => {
                        setAnchorEl((prevState)=> prevState.map((state, index2)=> index == index2 ? null :state ));
                      }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Box>
                        <ListItemButton
                          onClick={() => {
                            setSelectedDocId(document.id);
                            setOpenDialog(true);
                          }}
                          sx={{ p: 2 }}
                        >
                          Rename
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            setSelectedDocId(document.id);
                            setOpenDialog3(true);
                            setSelectedDocName(document.name)
                          }}
                          sx={{ p: 2 }}
                        >
                          Share
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            setSelectedDocId(document.id);
                            setOpenDialog2(true);
                          }}
                          sx={{ p: 2 }}
                        >
                          Delete
                        </ListItemButton>
                      </Box>
                    </Popover>
                  </Box>
                );
              })}
          </List>
        </Box>
      </Container>
      <Dialog
        onClose={() => {
          setOpenDialog(false);
          setSelectedDocId(null);
        }}
        open={openDialog}
      >
       <Box sx={{p:2}}>
       <DialogTitle>Enter Name of document</DialogTitle>
        <TextField
        fullWidth
          value={newDocName}
          onChange={(e) => {
            setDocName(e.target.value);
          }}
        />
        <Box sx={{ display: "flex", gap: 5, p:'10px !important' }}>
          <Button fullWidth onClick={handleRename} color="primary" variant="contained">
            Rename
          </Button>
          <Button fullWidth onClick={()=>{setOpenDialog(false)}}  color="error" variant="contained">
            Discard
          </Button>
        </Box>

       </Box>
      </Dialog>
      <Dialog
        onClose={() => {
          setOpenDialog2(false);
          setSelectedDocId(null);
        }}
        open={openDialog2}
      >
        <Box sx={{p:1}}>
        <DialogTitle>Are you sure you want to delete this document?</DialogTitle>
        
        <Box sx={{ display: "flex",justifyContent: 'space-between', gap: 5, p:'10px !important' }}>
          <Button fullWidth onClick={removeDocument} color="primary" variant="contained">
            Delete
          </Button>
          <Button fullWidth onClick={()=>{setOpenDialog2(false)}}  color="error" variant="contained">
            Discard
          </Button>
        </Box>
        </Box>
      </Dialog>
      <Dialog
        onClose={() => {
          setOpenDialog3(false);
          setSelectedDocId(null);
        }}
        open={openDialog3}
      >
        <Box sx={{p:1}}>
        <DialogTitle>Enter the email you want to share to? (Make sure the user Exists.)</DialogTitle>
         <TextField
        fullWidth
          value={sharedUserName}
          onChange={(e) => {
            setSharedUserName(e.target.value);
          }}
        />
        <Box sx={{ display: "flex",justifyContent: 'space-between', gap: 5, p:'10px !important' }}>
          <Button fullWidth onClick={()=>{
            shareDocument(document.name)}} color="primary" variant="contained">
            Add
          </Button>
          <Button fullWidth onClick={()=>{setOpenDialog3(false)}}  color="error" variant="contained">
            Discard
          </Button>
        </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default Homepage;
