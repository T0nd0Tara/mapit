export interface IFetchWithTiming {
  res: Response,
  timing: PerformanceResourceTiming | undefined
};

export async function fetchWithTiming(...args: Parameters<typeof fetch>): Promise<IFetchWithTiming> {
  const performancePromise: Promise<PerformanceObserverEntryList> = new Promise((resolve, _reject) => {
    const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
      resolve(list);
    });

    observer.observe({ type: "resource" });
  });

  const res: Response = await fetch(...args);
  const timings: PerformanceObserverEntryList = await performancePromise;

  const resourceTimings: PerformanceResourceTiming[] = timings.getEntriesByType('resource') as PerformanceResourceTiming[];
  const timing: PerformanceResourceTiming | undefined = resourceTimings
    .find((entry: PerformanceResourceTiming) => entry.initiatorType === 'fetch');

  return { res, timing };
}
