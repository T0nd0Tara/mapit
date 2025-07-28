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
import { IHeader, IHeaders, IParams, IRequestState } from "./types/request";
import { IKeyValueObj } from "./components/common/key-value-editable-table";
import url from 'url'
import { indexOfOrUndefined } from "./utils/string";

enum ViewMethod {
  PRETTY = 'Pretty',
  RAW = 'Raw',
  PREVIEW = 'Preview',
}

export default function App() {
  const request: IRequestState = {
    url: useComState(""),
    method: useComState<HttpMethod>(HttpMethod.GET),
    params: useComState<IParams | undefined>([]),
    headers: useComState<IHeaders | undefined>([]),
    body: useComState(null),
  };

  const [response, setResponse] = useState("");
  const [viewMethod, setViewMethod] = useState();

  const uri = useComState<string>("");

  const keyValToObject = (vals: IKeyValueObj[]): any =>
    vals.reduce((prev, keyVal: IKeyValueObj) => {
      if (keyVal.enabled)
        prev[keyVal.key] = keyVal.value;
      return prev;
    }, {} as { [key: string]: string });

  const getAxiosRequestConfig = (request: IRequestState): AxiosRequestConfig<any> => ({
    // url: /^http[s]?:\/\//.test(request.url.value) ?
    //   request.url.value : `http://${request.url.value}`,
    url: request.url.value,
    method: request.method.value,
    params: keyValToObject(request.params.value ?? []),
    headers: keyValToObject(request.headers.value ?? []),
    data: request.body.value,
  })
  const uriFromRequest = (request: IRequestState): string =>
    axios.getUri(getAxiosRequestConfig(request));

  const getParamString = (params: IKeyValueObj[]) =>
    params.map(param => {
      const value = param.value ? `=${param.value}` : "";
      return `${param.key}${value}`
    }).join('&')

  // Set uri based on params change
  useEffect(() => {
    const questionMarkIndex: number | undefined = indexOfOrUndefined(uri.value, '?')
    const paramsString: string = getParamString(request.params.value ?? []);
    if (questionMarkIndex === undefined) {
      if (paramsString) uri.set(`${uri.value}?${paramsString}`);
      return;
    }

    const hashIndex: number | undefined = indexOfOrUndefined(uri.value, '#', questionMarkIndex)
    const fragment = hashIndex === undefined ? "" : uri.value.substring(hashIndex);
    uri.set(
      uri.value.substring(0, questionMarkIndex + 1)
      + paramsString
      + fragment
    )
  }, [request.params.value])


  const setRequestFromUri = (newUri: string) => {
    uri.set(newUri)
    newUri = decodeURI(newUri);
    const questionMarkIndex: number | undefined = indexOfOrUndefined(newUri, '?');
    request.url.set(newUri.substring(0, questionMarkIndex ?? newUri.length));

    let params: IKeyValueObj[] = []
    if (questionMarkIndex !== undefined) {
      const hashIndex: number | undefined = indexOfOrUndefined(newUri, '#', questionMarkIndex);
      params = newUri.substring(questionMarkIndex + 1, hashIndex ?? newUri.length)
        .split('&')
        .map((keyVal: string) => {
          const equalIndex: number | undefined = indexOfOrUndefined(keyVal, '=');
          const key = keyVal.substring(0, equalIndex);
          const value = equalIndex !== undefined ? keyVal.substring(equalIndex + 1) : "";
          return {
            key,
            value,
            enabled: true
          }
        });
    }
    request.params.set(params);
  }



  const sendRequest = async () => {
    try {
      const res = await axios.request(getAxiosRequestConfig(request));
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
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
                data-testid='uri-input'
                type="text"
                placeholder="Enter URL"
                value={uri.value}
                onChange={(e) => setRequestFromUri(e.target.value)}
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
