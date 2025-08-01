export function ResponseStatusCode({
  statusCode,
  statusText,
  ...props
}: {
  statusCode: number
  statusText: string
}) {
  return (
    <div {...props}>{statusCode} {statusText}</div>
  )
}
