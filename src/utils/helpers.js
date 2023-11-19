export function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function fetchUtil(url, options = {},) {
  return fetch(url, options,).then((res) => {
    if (!res.ok) {
      return res.json().then((json,) => {
        if (res.status.toString() === '401') {
          // TODO: handle the unauthorized case of the backend
          // 401: Auth Token expired. Please login again
          // 422:
        }
        return Promise.reject(json);
      });
    }
    return res.json();
  });
};

export function currencyFormat(amount, fallbackValue='') {
  if(!amount) return fallbackValue;

  const options = {
      maximumFractionDigits: 2,
      currency: 'NGN',
      style: 'currency',
  };
  const currencyValue = amount.toLocaleString('en-NG', options)
  // format the currency to have a space between symbol and value
  return currencyValue.replace(/(\D)(\d)/, '$1 $2'); // $1 is the matched character, $2 is the captured group
}

function getDayAndTime(timestamp) {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
  const time = date.toLocaleTimeString('en-GB', {hour: '2-digit',
  minute: 'numeric', hour12: false});

  return {day,time};
}

/**
 * Idea:
 * This can return a map of date label and the corresponding send/grey values.
 * This would prevent having duplicates in the label and the earliest value is
 * shown
 */
export function generateNivoChartData(data, currency= 'eur') {
  const dates = [];
  const send = [];
  const grey = [];
  const transferGo = [];

  data.slice(-7).forEach(entry => {
    const {day, time} = getDayAndTime(entry[0]);
    const obj = entry[1];
    let x;

    // skip duplicate date
    if(dates.includes(day)) {
      // use time
      x = time;
      dates.push(time);

    } else {
      x = day;
      dates.push(day);
    }

    send.push({
      x,
      y: obj.send[currency] || 0,
    });
    grey.push({
      x,
      y: obj.grey[currency] || 0,
    });
    transferGo.push({
      x,
      y: obj.transferGo[currency] || 0,
    })
    return;
  });

  return [
    {
      id: 'Send',
      data: send,
      color: '#219653'
    },
    {
      id: 'Grey',
      data: grey,
      color: '#F2994A'
    },
    {
      id: 'TransferGo',
      data: transferGo,
      color: '#EB5757'
    }
  ]
}

function roundUp(num, multiple) {
  return Math.ceil(num / multiple) * multiple;
}

function roundDown(num, multiple) {
  return Math.floor(num / multiple) * multiple;
}

export function generateYAxis(data){
    const y = data.flatMap((d) => d.data.map((d) => d.y));
    const min = roundDown(Math.min(...y), 10);
    const max = roundUp(Math.max(...y), 10);
    const step = Math.round((max - min) / 5);
    const ticks = [];

    for (let i = min; i <= max; i += step) {
        ticks.push(i);
    }
    
    return { ticks, min, max };
}