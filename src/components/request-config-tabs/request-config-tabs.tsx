import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { IRequestState } from "@/types/request";
import { RequestHeadersConfig } from "@/components/request-config-tabs/request-header-config";
import { RequestParamConfig } from "./request-param-config";

export function RequestConfigTabs({
  request,
  ...props
}:
  React.ComponentProps<typeof Tabs> & {
    request: IRequestState,
  }) {
  return (
    <Tabs defaultValue="headers" {...props}>
      <TabsList className="gap-1">
        <TabsTrigger value="headers">Headers ({request.headers.value.length})</TabsTrigger>
        <TabsTrigger value="params">Params ({request.params.value.length})</TabsTrigger>
        <TabsTrigger value="body">Body</TabsTrigger>
      </TabsList>
      <TabsContent value="headers">
        <RequestHeadersConfig headers={request.headers}></RequestHeadersConfig>
      </TabsContent>
      <TabsContent value="params">
        <RequestParamConfig params={request.params} />
      </TabsContent>
      <TabsContent value="body">
        <Textarea
          placeholder="Request Body (JSON)"
          value={request.body.value as string}
          onChange={(e) => request.body.set(e.target.value)}
          className="w-full h-full"
        />
      </TabsContent>
    </Tabs>

  )
}
