import { isDev } from "../utils/constants";
import { fetchUtil, getRandomArbitrary } from "../utils/helpers";

type ValueMap = Partial<[number, Record<string, any>]>;
function generateDevRateValues(length: number): ValueMap {
  const time = Array.from({ length }, (_) => getRandomArbitrary(1662504016195, 1662704016195)).sort();
  const valueMap: ValueMap = [];

  time.forEach(val => {
    valueMap.push([val, {
      send: {
        "eur": getRandomArbitrary(650, 700),
        "usd": getRandomArbitrary(650, 700),
        "gbp": getRandomArbitrary(750, 850)
      },
      grey: {
        "eur": getRandomArbitrary(650, 700),
        "usd": getRandomArbitrary(650, 690),
        "gbp": getRandomArbitrary(750, 850)
      },
    }])
  })

  return valueMap;
}

function generateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export async function getKVRates(): Promise<ValueMap> {
  if (isDev) {
    return generateDevRateValues(10);
  }

  // make call to worker to get the values
  const kvRates = await fetchUtil('https://fxrates-worker.adexot.workers.dev');
  return kvRates.data;
}


interface ChartData {
  labels: string[];
  grey: number[];
  send: number[];
}
/**
 * Idea:
 * This can return a map of date label and the corresponding send/grey values.
 * This would prevent having duplicates in the label and the earliest value is
 * shown
 */
export function generateChartData(data: ValueMap, currency: string = 'eur'): ChartData {
  const labels = [];
  const send = [];
  const grey = [];

  data.slice(-7).forEach(entry => {
    labels.push(generateLabel(entry[0]));
    const obj = entry[1];
    send.push(obj.send[currency]);
    grey.push(obj.grey[currency]);
  });

  return {
    labels,
    send,
    grey
  }
}
