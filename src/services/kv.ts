import { isDev } from "../utils/constants";
import { getRandomArbitrary } from "../utils/helpers";

type ValueMap = Map<number, Record<string, number>>;
function generateDevRateValues(length: number): ValueMap {
  const time = Array.from({ length }, (_) => getRandomArbitrary(1662504016195, 1662704016195)).sort();
  const valueMap: ValueMap = new Map();

  time.forEach(val => {
    valueMap.set(val, { send: getRandomArbitrary(650, 700), grey: getRandomArbitrary(650, 700) })
  })

  return valueMap;
}

function generateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getKVRates(): ValueMap {
  if (isDev) {
    return generateDevRateValues(10);
  }

  // make calls to kv to get the values
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
export function generateChartData(data: ValueMap): ChartData {
  const labels = [];
  const send = [];
  const grey = [];



  Array.from(data.keys()).slice(-7).forEach((key) => {
    labels.push(generateLabel(key));
    const obj = data.get(key);
    send.push(obj.send);
    grey.push(obj.grey);
  });

  return {
    labels,
    send,
    grey
  }
}
