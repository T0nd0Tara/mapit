import { IState } from "@/types/state";
import { IFetchWithTiming } from "@/utils/fetch";
import { Textarea } from "../ui/textarea";
import { useComState } from "@/utils/react";
import { useTransition } from "react";

export function Response({ response, isRequestActive, ...props }:
  {
    response: IFetchWithTiming | null,
    isRequestActive: boolean
  }) {
  const body = useComState<string>("");
  const [isBodyPending, bodyTransition] = useTransition();

  bodyTransition(async () => {
    const fetchedBody = await response?.res.text();
    bodyTransition(() => {
      body.set(fetchedBody ?? "");
    })
  })

  return (
    <Textarea
      readOnly
      placeholder="Response will appear here"
      value={body.value}
      className="w-full h-60"
      data-testid='response-output'
    />
  );
}
