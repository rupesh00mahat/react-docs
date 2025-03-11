import { Editor } from "@monaco-editor/react";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "@mui/material";

function EditorWrapper() {
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const handleEditorDidMount = (editor, monaco) => {
    console.log("editor", editor);
    console.log("monaco", monaco);
  };
  const executeCode = async (language, code) => {
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          version: "*",
          files: [{ content: code }],
        }),
      });
      const result = await response.json();
      console.log("result",result);
      console.log("result.run.stdout",result.run.stdout);
      console.log("result.run.stderr",result.run.stderr);
    } catch (err) {
      setError("ExecutionFailed:", err.message);
    }
  };

  return (
    <div>
      <Button
      variant="contained"
      sx={{m:2}}
        onClick={() => {
          executeCode("javascript", code);
        }}
      >
        Run
      </Button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// This is your playground"
        onMount={handleEditorDidMount}
        onChange={(value)=>{setCode(value)}}
      />
    </div>
  );
}

export default EditorWrapper;
