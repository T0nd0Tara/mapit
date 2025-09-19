import { useAsync } from "react-async"
import { fs } from "@/utils/node.ts"
import { getConfig } from "@/utils/mapit-configs";

async function getFiles() {
  const files = []
  for await (const file of fs.glob('/home/amirs/.mapit/*')) {
    files.push(file);
  }
  return files;
}
export function FileExplorer({
  ...props
}: React.ComponentProps<"div">
) {
  const files = useAsync(getConfig);
  if (files.data) {
    console.log('files.data')
    console.log(files.data)
  }

  return (
    <div {...props}>
    </div>
  )
}
