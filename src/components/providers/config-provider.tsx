import { createContext, use, useEffect, useMemo } from "react"
import { Config, getConfig, writeConfig } from "@/utils/mapit-configs";
import { useAsync } from "react-async";

export type ConfigProviderState = ReturnType<typeof useAsync<Config>>;

// @ts-expect-error: we don't put here the initial value, as we put it later anyway
const ConfigProviderContext = createContext<ConfigProviderState>();

export function ConfigProvider({
  children,
  ...props
}: { children: React.ReactNode }) {
  const config = useAsync<Config>({ promiseFn: getConfig });
  const writeConfigHook = useAsync<Awaited<ReturnType<typeof writeConfig>>>({
    deferFn: ([newConfig]) => writeConfig(newConfig)
  });


  useEffect(() => {
    if (config.data) writeConfigHook.run(config.data);
  }, [config]);

  return (
    <ConfigProviderContext {...props} value={config}>
      {children}
    </ConfigProviderContext>
  )
}

export const useConfig = (): ConfigProviderState => {
  const context: ConfigProviderState | undefined = use(ConfigProviderContext);

  if (context === undefined)
    throw new Error("useConfig must be used within a ConfigProvider")

  return context
}
