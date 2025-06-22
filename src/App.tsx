import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import axios, { AxiosRequestConfig } from "axios";
import { useComState } from '@/utils/react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IpcSocketConnectOpts } from "node:net";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import _ from "lodash"
import { IState } from "./types/state";
import { RequestConfigTabs } from "./components/request-config-tabs/request-config-tabs";
import { HttpMethod } from "./types/http";
import { IHeader, IRequestState } from "./types/request";

enum ViewMethod {
  PRETTY = 'Pretty',
  RAW = 'Raw',
  PREVIEW = 'Preview',
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
    headers: useComState([]),
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
        headers: request.headers.value.reduce((prev, header: IHeader) => {
          if (header.enabled)
            prev[header.key] = header.value;
          return prev;
        }, {}),
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
            <div className="flex space-x-2 mb-2">
              <Select onValueChange={(value: string) => request.method.set(value as HttpMethod)} defaultValue={HttpMethod.GET}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(HttpMethod).map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
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
              <Button onClick={sendRequest} variant="outline">Send</Button>
            </div>

            <RequestConfigTabs request={request}></RequestConfigTabs>

          </ResizablePanel>
          <ResizableHandle withHandle className="my-3" />
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
