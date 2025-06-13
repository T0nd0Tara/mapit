import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PostmanApp() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");

  const sendRequest = async () => {
    try {
      const config = {
        method,
        url,
        ...(method !== "GET" && { data: JSON.parse(body || '{}') }),
      };
      const res = await axios(config);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">React Postman Clone</h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex space-x-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <Input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={sendRequest}>Send</Button>
          </div>
          {(method !== "GET") && (
            <Textarea
              placeholder="Request Body (JSON)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-40"
            />
          )}
          <Textarea
            readOnly
            placeholder="Response will appear here"
            value={response}
            className="w-full h-60"
          />
        </CardContent>
      </Card>
    </div>
  );
}
