import { useEffect, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useComState } from '@/utils/react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { Response } from '@/components/response/response';
import _ from "lodash"
import { RequestConfigTabs } from "./components/request-config-tabs/request-config-tabs";
import { HttpMethod } from "./types/http";
import { IHeaders, IParams, IRequestState } from "./types/request";
import { indexOfOrUndefined } from "./utils/string";
import { StringObject } from "./types/object";
import { IKeyValueObj } from "./types/key-value";
import { fetchWithTiming, IFetchWithTiming } from "./utils/fetch";
import { isNullOrUndefined } from 'is-what';

/*
enum ViewMethod {
  PRETTY = 'Pretty',
  RAW = 'Raw',
  PREVIEW = 'Preview',
}
*/

export default function App() {
  const request: IRequestState = {
    url: useComState(""),
    method: useComState<HttpMethod>(HttpMethod.GET),
    params: useComState<IParams>([]),
    headers: useComState<IHeaders>([]),
    body: useComState<unknown>(null),
  };

  const response = useComState<IFetchWithTiming | null>(null);
  const [isRequestActive, requestTransition] = useTransition();
  // const [viewMethod, setViewMethod] = useState();

  const uri = useComState<string>("");

  const keyValToObject = (vals: IKeyValueObj[]): StringObject =>
    vals.reduce((prev, keyVal: IKeyValueObj) => {
      if (keyVal.enabled)
        prev[keyVal.key] = keyVal.value;
      return prev;
    }, {} as StringObject);

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


  const sendRequest = () => {
    requestTransition(async () => {
      let res = null
      try {
        res = await fetchWithTiming(
          uri.value,
          {
            headers: keyValToObject(request.headers.value),
            body: isNullOrUndefined(request.body.value) ? null : JSON.stringify(request.body.value),
          }
        );
      } catch (_err: unknown) {
        // TODO: If there's an error, we want to see it. Replace `null`
      }

      requestTransition(() => {
        response.set(res);
      });
    });
  };

  return (
    <div className="w-dvw h-dvh p-3">
      <ResizablePanelGroup direction="vertical" style={{ height: "100%" }}>
        <ResizablePanel minSize={40}>
          <form className="flex space-x-2 mb-2" onSubmit={(e) => { e.preventDefault(); sendRequest(); }}>
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
            <Button type="submit" variant="outline" data-testid="send-request-button">Send</Button>
          </form>

          <RequestConfigTabs request={request}></RequestConfigTabs>

        </ResizablePanel>
        <ResizableHandle withHandle className="my-3" />
        <ResizablePanel>
          <Response response={response.value} isRequestActive={isRequestActive} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
