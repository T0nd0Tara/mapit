export function ResponseTiming({
  timing
}: {
  timing: PerformanceResourceTiming | undefined
}) {
  if (timing === undefined) return (<div>No Time Data</div>);

  const totalTime = timing.responseEnd - timing.startTime;
  return (
    <div>{totalTime} ms</div>
  )
}
