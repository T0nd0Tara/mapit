import { useAsync } from "react-async"
// // @ts-expect-error: it wouldn't find node packages 
// import fs from 'node:fs/promises';
const req = (window as any).require;
const fs = req('node:fs').promises;

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
