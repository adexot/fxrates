const generateSendUrl = path => `https://sendgateway.myflutterwave.com/api/v1/config/countrypairs/${path}`;

export async function getAllRates(): Promise<any> {
  const getGreyRates = fetchUtil('https://api.aboki.africa/v2/currency/display');
  const getSendEURRate = fetchUtil(generateSendUrl('NL?to=NG'));
  const getSendGBPRate = fetchUtil(generateSendUrl('GB?to=NG'));
  const getSendUSDRate = fetchUtil(generateSendUrl('US?to=NG'));

  const [
    greyRates,
    sendEURRate,
    sendGBPRate,
    sendUSDRate] = await Promise.all([getGreyRates, getSendEURRate, getSendGBPRate, getSendUSDRate]);

  const batchResponse = [
    { title: 'grey', rate: {} },
    { title: 'send', rate: {} }
  ];

  greyRates.forEach(element => {
    batchResponse[0].rate[element.currency.toLowerCase()] = element.buy_rate
  });

  batchResponse[1].rate['eur'] = getNGNValueFromSend(sendEURRate['data']);
  batchResponse[1].rate['gbp'] = getNGNValueFromSend(sendGBPRate['data']);
  batchResponse[1].rate['usd'] = getNGNValueFromSend(sendUSDRate['data']);

  return batchResponse;
}

function getNGNValueFromSend(res) {
  const ngValue = res.filter(el => el.toCurrencyCode.toLowerCase() === 'ngn');

  return ngValue[0].exchangeRate;
}

function fetchUtil(url, options = {},) {
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
