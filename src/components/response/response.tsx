import { IFetchWithTiming } from "@/utils/fetch";
import { Textarea } from "@/components/ui/textarea";
import { useComState } from "@/utils/react";
import { useEffect } from "react";
import { ResponseTiming } from "./response-timing";

export function Response({ response, isRequestActive, ...props }:
  {
    response: IFetchWithTiming | null,
    isRequestActive: boolean
  } & React.ComponentProps<"div">) {
  const body = useComState<string>("");

  useEffect(() => {
    (async () => {
      const fetchedBody = await response?.res.text();
      body.set(fetchedBody ?? "");
    })()
  }, [response?.res.text]);

  props.className ??= "";
  props.className += " w-full"

  return (
    <div {...props}>
      <div className="flex mb-2">
        <div className="ms-1 me-auto"></div>
        <div className="me-1">
          <ResponseTiming timing={response?.timing}></ResponseTiming>
        </div>
      </div>
      <Textarea
        readOnly
        placeholder="Response will appear here"
        value={body.value}
        className="w-full h-60"
        data-testid='response-output'
      />
    </div>
  );
}
