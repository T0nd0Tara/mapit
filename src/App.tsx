import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
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
  Select, SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IpcSocketConnectOpts } from "node:net";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";

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

interface IState<T> {
  value: T,
  set: (newValue: T) => void,
}

function useComState<T>(initialState: T): IState<T> {
  const [value, set] = useState<T>(initialState);
  return { value, set };
}

interface IRequest {
  method: HttpMethod,
  url: string,
  params?: { [key: string]: any },
  body?: any,
  headers?: { [key: string]: string },
};

type IRequestState = { [key in keyof IRequest]: IState<IRequest[key]> };

function RequestConfigTabs({ request }: { request: IRequestState }) {
  return (
    <Tabs defaultValue="headers">
      <TabsList>
        <TabsTrigger value="headers">Headers</TabsTrigger>
        <TabsTrigger value="params">Params</TabsTrigger>
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
        <Textarea
          placeholder="Request Body (JSON)"
          value={request.body.value}
          onChange={(e) => request.body.set(e.target.value)}
          className="w-full h-40"
        />
      </TabsContent>
    </Tabs>

  )
}

export default function App() {
  // const [method, setMethod] = useState<string>(HttpMethod.GET);
  // const [url, setUrl] = useState("");
  // const [body, setBody] = useState(null);
  //
  const request: IRequestState = {
    url: useComState(""),
    method: useComState(HttpMethod.GET),
    params: useComState({}),
    headers: useComState({}),
    body: useComState(null),
  };
  const [response, setResponse] = useState("");
  const [viewMethod, setViewMethod] = useState();

  const sendRequest = async () => {
    try {
      const config: AxiosRequestConfig<any> = {
        url: request.url.value,
        method: request.method.value,
        params: request.params.value,
        headers: request.headers.value,
        data: request.body.value,
      };
      const res = await axios.request(config);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse(err.message);
    }
  };

  return (
    <Card className="w-dvw h-dvh">
      <CardContent className="space-y-4 p-4" style={{ height: "100%" }}>
        <ResizablePanelGroup direction="vertical" style={{ height: "100%" }}>
          <ResizablePanel minSize={40}>
            <div className="flex space-x-2">
              <Select onValueChange={(value: string) => request.method.set(value as HttpMethod)} defaultValue={HttpMethod.GET}>
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
                value={request.url.value}
                onChange={(e) => request.url.set(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={sendRequest}>Send</Button>
            </div>

            <RequestConfigTabs request={request}></RequestConfigTabs>

          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <Textarea
              readOnly
              placeholder="Response will appear here"
              value={response}
              className="w-full h-60"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
