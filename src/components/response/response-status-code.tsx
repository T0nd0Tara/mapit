export function ResponseStatusCode({
  statusCode,
  statusText,
  ...props
}: {
  statusCode: number
  statusText: string
}) {
  return (
    <div {...props}
      data-testid="response-status-code"
    >{statusCode} {statusText}</div>
  )
}
