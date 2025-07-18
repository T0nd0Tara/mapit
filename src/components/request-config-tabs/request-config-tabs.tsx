import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { IRequestState } from "@/types/request";
import { RequestHeadersConfig } from "@/components/request-config-tabs/request-header-config";
import { RequestParamConfig } from "./request-param-config";

export function RequestConfigTabs({ request }: { request: IRequestState }) {
  return (
    <Tabs defaultValue="headers">
      <TabsList>
        <TabsTrigger value="headers">Headers ({request.headers?.value.length})</TabsTrigger>
        <TabsTrigger value="params">Params ({request.params?.value.length})</TabsTrigger>
        <TabsTrigger value="body">Body</TabsTrigger>
      </TabsList>
      <TabsContent value="headers">
        <RequestHeadersConfig headers={request.headers}></RequestHeadersConfig>
        {/* <Card> */}
        {/*   <CardHeader> */}
        {/*     <CardTitle>Account</CardTitle> */}
        {/*     <CardDescription> */}
        {/*       Make changes to your account here. Click save when you&apos;re */}
        {/*       done. */}
        {/*     </CardDescription> */}
        {/*   </CardHeader> */}
        {/*   <CardContent className="grid gap-6"> */}
        {/*     <div className="grid gap-3"> */}
        {/*       <Label htmlFor="tabs-demo-name">Name</Label> */}
        {/*       <Input id="tabs-demo-name" defaultValue="Pedro Duarte" /> */}
        {/*     </div> */}
        {/*     <div className="grid gap-3"> */}
        {/*       <Label htmlFor="tabs-demo-username">Username</Label> */}
        {/*       <Input id="tabs-demo-username" defaultValue="@peduarte" /> */}
        {/*     </div> */}
        {/*   </CardContent> */}
        {/*   <CardFooter> */}
        {/*     <Button>Save changes</Button> */}
        {/*   </CardFooter> */}
        {/* </Card> */}
      </TabsContent>
      <TabsContent value="params">
        <RequestParamConfig params={request.params} />
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
