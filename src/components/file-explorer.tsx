import { useAsync } from "react-async"
import { fs, path } from "@/utils/node.ts"
import { Config, getConfig } from "@/utils/mapit-configs";
import { ConfigProviderState, useConfig } from "./providers/config-provider";
import { useCallback } from "react";

async function getFiles(routesDir: string) {
  const files = []
  for await (const file of fs.glob(path.join(routesDir, '*'))) {
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

  if (files.data) {
    console.log('files.data')
    console.log(files.data)
  }

  return (
    <div {...props}>
    </div>
  )
}
