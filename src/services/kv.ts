import { isDev } from "../utils/constants";
import { fetchUtil, getRandomArbitrary } from "../utils/helpers";

type ValueMap = Partial<[number, Record<string, any>]>;
function generateDevRateValues(length: number): ValueMap {
  const time = Array.from({ length }, (_) => getRandomArbitrary(1662504016195, 1662704016195)).sort();
  const valueMap: ValueMap = [];

  time.forEach(val => {
    const min = 700;
    const max = 1370;

    valueMap.push([val, {
      send: {
        "eur": getRandomArbitrary(min, max),
        "usd": getRandomArbitrary(min, max),
        "gbp": getRandomArbitrary(750, max)
      },
      grey: {
        "eur": getRandomArbitrary(min, max),
        "usd": getRandomArbitrary(min, max),
        "gbp": getRandomArbitrary(min, max)
      },
      transferGo: {
        "eur": getRandomArbitrary(min, max),
        // "usd": getRandomArbitrary(min, max),
        "gbp": getRandomArbitrary(min, max)
      },
    }])
  })

  return valueMap;
}

function generateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

type Filter = {
  from: string;
  to: string;
  count: number;
}
export async function getKVRates(filter?: Filter): Promise<ValueMap> {
  // if (isDev) {
  //   return generateDevRateValues(20);
  // }
  
  let query = '';
  if(filter){
    Object.keys(filter).forEach(key => {
      if(filter[key]){
        query += `${key}=${filter[key]}&`
      }
    })
  }

  // make call to worker to get the values
  const kvRates = await fetchUtil(`https://fxrates-worker.adexot.workers.dev?${query}`);
  return kvRates.data;
}


interface ChartData {
  labels: string[];
  grey: number[];
  send: number[];
  transferGo: number[];
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
  const transferGo = [];

  data.slice(-7).forEach(entry => {
    labels.push(generateLabel(entry[0]));
    const obj = entry[1];
    send.push(obj.send[currency]);
    grey.push(obj.grey[currency]);
    transferGo.push(obj.transferGo[currency] || 0)
  });

  return {
    labels,
    send,
    grey, 
    transferGo,
  }
}
