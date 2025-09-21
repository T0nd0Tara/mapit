import { useAsync } from "react-async"
import { fs, path } from "@/utils/node.ts"
import { Config, getConfig } from "@/utils/mapit-configs";
import { ConfigProviderState, useConfig } from "./providers/config-provider";
import { useCallback } from "react";
import { TreeView, TreeDataItem } from '@/components/ui/tree-view';
import type { Dirent } from "fs";
async function getFileTree(routesDir: string): Promise<TreeDataItem> {
  await fs.mkdir(routesDir, { recursive: true });
  const recursiveGetFileTree = async (dir: Dirent<string> | string): Promise<TreeDataItem> => {
    const fullPath: string = typeof dir === 'string' ? dir : path.resolve(dir.parentPath, dir.name);
    let children: TreeDataItem[] | undefined = undefined;

    if (typeof dir === 'string' || dir.isDirectory()) {
      const childFiles = await fs.readdir(fullPath, { recursive: false, withFileTypes: true });
      children = await Promise.all(childFiles.map(child => recursiveGetFileTree(child)));
    }

    return {
      id: fullPath,
      name: typeof dir === 'string'
        ? path.basename(dir)
        : dir.isFile()
          ? path.parse(dir.name).name
          : dir.name,
      children
    };
  };
  return await recursiveGetFileTree(routesDir);
}

export function FileExplorer({
  ...props
}: React.ComponentProps<"div">
) {
  const configState: ConfigProviderState = useConfig();
  if (configState.isPending) return <> No Pablo espanol </>;
  const config: Config = configState.data!;

  const fileTree = useAsync({
    promiseFn: useCallback(() => getFileTree(config.routesDir), [config.routesDir])
  });

  if (fileTree.isPending) return <> Reading routes folder </>;
  const treeData = fileTree.data!;

  return (
    <TreeView {...props} data={treeData.children!} />
  )
}
