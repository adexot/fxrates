import { fetchUtil } from "../utils/helpers";

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

  const batchResponse = {
    grey: {},
    send: {}
  }

  greyRates.forEach(element => {
    batchResponse.grey[element.currency.toLowerCase()] = element.buy_rate
  });

  batchResponse.send['eur'] = getNGNValueFromSend(sendEURRate['data']);
  batchResponse.send['gbp'] = getNGNValueFromSend(sendGBPRate['data']);
  batchResponse.send['usd'] = getNGNValueFromSend(sendUSDRate['data']);

  return batchResponse;
}

function getNGNValueFromSend(res) {
  const ngValue = res.filter(el => el.toCurrencyCode.toLowerCase() === 'ngn');

  return ngValue[0].exchangeRate;
}
