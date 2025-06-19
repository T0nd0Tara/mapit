import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

enum ViewMethod {
  PRETTY = 'Pretty',
  RAW = 'Raw',
  PREVIEW = 'Preview',
}

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

function RequestConfigTabs() {
  return (
    <Tabs defaultValue="headers">
      <TabsList>
        <TabsTrigger value="headers">Headers</TabsTrigger>
        <TabsTrigger value="body">Body</TabsTrigger>
      </TabsList>
      <TabsContent value="headers">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&apos;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-name">Name</Label>
              <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-username">Username</Label>
              <Input id="tabs-demo-username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="body">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you&apos;ll be logged
              out.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-current">Current password</Label>
              <Input id="tabs-demo-current" type="password" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-new">New password</Label>
              <Input id="tabs-demo-new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>

  )
}

export default function App() {
  const [method, setMethod] = useState(HttpMethod.GET);
  const [url, setUrl] = useState("");
  const [body, setBody] = useState(null);
  const [response, setResponse] = useState("");
  const [viewMethod, setViewMethod] = useState();

  const sendRequest = async () => {
    try {
      const config = {
        method,
        url,
        ...(method !== "GET" && { data: JSON.parse(body ?? '{}') }),
      };
      const res = await axios.request(config);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse(err.message);
    }
  };

  return (
    <Card className="w-dvw h-dvh">
      <CardContent className="space-y-4 p-4">
        <div className="flex space-x-2">
          <Select onValueChange={setMethod} defaultValue={HttpMethod.GET}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(HttpMethod).map(method => (
                <SelectItem value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <RequestConfigTabs></RequestConfigTabs>
        <Textarea
          readOnly
          placeholder="Response will appear here"
          value={response}
          className="w-full h-60"
        />
      </CardContent>
    </Card>
  );
}
