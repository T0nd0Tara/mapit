import { useAsync } from "react-async"
import { fs } from "@/utils/node.ts"

async function getFiles() {
  const files = []
  for await (const file of fs.glob('/home/amirs/code/mapit/*')) {
    files.push(file);
  }
  return files;
}
export function FileExplorer({

  ...props
}: React.ComponentProps<"div">
) {
  const files = useAsync(getFiles);
  if (files.data) console.log(files.data)

  return (
    <div {...props}>
    </div>
  )
}
