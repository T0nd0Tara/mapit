// import undici, { symbols } from 'undici'
//
// const undRes = await undici.fetch('https://www.google.com');
//
// console.log(undRes)
// console.dir(undRes)
async function customFetch(...args) {

  const start = performance.now();

  const res = await fetch(...args);
  const end = performance.now();

  // Basic duration
  const timing = {
    duration: end - start,
    start,
    end,
  };

  // Node-level Undici timings
  const symbols = Object.getOwnPropertySymbols(res);
  const stateSymbol = symbols.find(symbol => symbol.toString() === 'Symbol(state)')

  if (stateSymbol) {
    // @ts-expect-error - it wont allow  indexing res with Symbol
    timing.undici = res[stateSymbol].timingInfo;
  }

  // Browser-level resource timing (delayed lookup)
  setTimeout(() => {
    const entries = performance.getEntriesByType('resource');
    const match = entries.find(e => e.name === res.url);
    if (match) {
      console.log('Browser PerformanceTiming:', match);
    }
  }, 0);

  return { res, timing };
}

const res = await customFetch('https://www.google.com');

console.log(res)
console.dir(res)
// const symbols = Object.getOwnPropertySymbols(res);
// for (const sym of symbols) {
//   console.log(sym, res[sym]);
// }
