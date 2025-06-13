import './App.scss'
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Stack
} from "@mui/material";

export default function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");

  const theme = useTheme();

  const sendRequest = async () => {
    try {
      const config = {
        method, url,
        ...(method !== "GET" && { data: JSON.parse(body || '{}') }),
      };
      const res = await axios(config);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse(err.message);
    }
  };

  return (
    <Box sx={{ p: 0, width: "100vw", height: "100vh", mw: "10", mx: 0 }}>
      <Card sx={{ height: "100%"}}>
        <CardContent sx={{ height: "100%"}}>
          <Stack
            spacing={2}
            mb={2}
          >
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              size="small"
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              size="small"
              label="Request URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button variant="contained" onClick={sendRequest}>
              Send
            </Button>
          </Stack>
          {method !== "GET" && (
            <TextField
              fullWidth
              multiline
              // minRows={6}
              label="Request Body (JSON)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            multiline
            // minRows={10}
            label="Response"
            value={response}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
        </CardContent>
      </Card>
    </Box>
  );
}
