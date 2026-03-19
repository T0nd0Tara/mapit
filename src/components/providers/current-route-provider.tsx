import { createContext, use } from "react"
import { IState } from "@/types/state";
import { useComState } from "@/utils/react";

export type CurrentRouteProviderState = IState<string | null>;

// @ts-expect-error: we don't put here the initial value, as we put it later anyway
const CurrentRouteProviderContext = createContext<CurrentRouteProviderState>();

export function CurrentRouteProvider({
  children,
  ...props
}: { children: React.ReactNode }) {
  const currentRoute = useComState<string | null>(null);

  return (
    <CurrentRouteProviderContext {...props} value={currentRoute}>
      {children}
    </CurrentRouteProviderContext>
  )
}

export const useCurrentRoute = (): CurrentRouteProviderState => {
  const currentRoute: CurrentRouteProviderState | undefined = use(CurrentRouteProviderContext);

  if (currentRoute === undefined)
    throw new Error("useCurrentRoute must be used within a CurrentRouteProvider")

  return currentRoute
}
