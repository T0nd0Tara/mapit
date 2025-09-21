import { useAsync } from "react-async"
import { fs, path } from "@/utils/node.ts"
import { Config, getConfig } from "@/utils/mapit-configs";
import { ConfigProviderState, useConfig } from "./providers/config-provider";
import { useCallback } from "react";
async function getFiles(routesDir: string) {
  await fs.mkdir(routesDir, { recursive: true });

  const files = []
  for await (const file of fs.glob(path.join(routesDir, '**', '*.json5'),)) {
    files.push(file);
  }
  return files;
}
export function FileExplorer({
  ...props
}: React.ComponentProps<"div">
) {
  const configState: ConfigProviderState = useConfig();
  if (configState.isPending) return <> No Pablo espanol </>;
  const config: Config = configState.data!;

  const files = useAsync({
    promiseFn: useCallback(() => getFiles(config.routesDir), [config.routesDir])
  });


  return (
    <div {...props}>
    </div>
  )
}
