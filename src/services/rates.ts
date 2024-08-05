import { fetchUtil } from "../utils/helpers";

// const generateSendUrl = path => `https://sendgateway.myflutterwave.com/api/v1/config/countrypairs/${path}`;

function catchAndReturnEmptyMap(e){
	console.error(e)
	return {};
}

async function getGreyRates() {
	const batchResponse = {};

	const res = await fetchUtil('https://user-gw.grey.engineering/v2/currency').catch(console.error);
	res.forEach(item => {
		const nairaConversions = ['usd-ngn', 'eur-ngn', 'gbp-ngn'];
		if (nairaConversions.includes(item.code.toLowerCase())) {
			batchResponse[item.from_code.toLowerCase()] = item.user_rate;
		}
	});

	return batchResponse;
}

async function getSendRates(){
	const generateSendUrl = path => `https://sendgateway.myflutterwave.com/api/v1/config/countrypairs/${path}`;
	const getSendEURRate = fetchUtil(generateSendUrl('NL?to=NG')).catch(catchAndReturnEmptyMap);
	const getSendGBPRate = fetchUtil(generateSendUrl('GB?to=NG')).catch(catchAndReturnEmptyMap);
	const getSendUSDRate = fetchUtil(generateSendUrl('US?to=NG')).catch(catchAndReturnEmptyMap);

  // @ts-ignore
	const [
		sendEURRate,
		sendGBPRate,
		sendUSDRate
	] = await Promise.all([
		getSendEURRate,
		getSendGBPRate,
		getSendUSDRate
	]).catch(console.error);

	const batchResponse = {};
	// Send value
	batchResponse['eur'] = getNGNValueFromSend(sendEURRate['data']);
	batchResponse['gbp'] = getNGNValueFromSend(sendGBPRate['data']);
	batchResponse['usd'] = getNGNValueFromSend(sendUSDRate['data']);


	return batchResponse;
}

async function getTransferGoRates(){
	const generateTransferGoUrl = qs => `https://my.transfergo.com/api/booking/quotes?${qs}&calculationBase=sendAmount` // qs => querystring

	const getTGEURRate = fetchUtil(generateTransferGoUrl('fromCurrencyCode=EUR&toCurrencyCode=NGN&fromCountryCode=NL&toCountryCode=NG&amount=100.00')).catch(catchAndReturnEmptyMap);
	const getTGGBPRate = fetchUtil(generateTransferGoUrl('fromCurrencyCode=GBP&toCurrencyCode=NGN&fromCountryCode=GB&toCountryCode=NG&amount=100.00')).catch(catchAndReturnEmptyMap);
	// USD currency is not supported yet
	// const getTGUSDRate = fetchUtil(generateTransferGoUrl('fromCurrencyCode=EUR&toCurrencyCode=NGN&fromCountryCode=NL&toCountryCode=NG&amount=10.00')).catch(catchAndReturnEmptyMap);

	const [
		TGEURRate,
		TGGBPRate,
		// TGUSDRate
	] = await Promise.all([
		getTGEURRate,
		getTGGBPRate,
		// getTGUSDRate
	]);

	const batchResponse = {};
	// Send value
	batchResponse['eur'] = getNGNValueFromTG(TGEURRate);
	batchResponse['gbp'] = getNGNValueFromTG(TGGBPRate);
	// batchResponse['usd'] = getNGNValueFromTG(TGUSDRate); // not available yet


	return batchResponse;
}

export async function getAllRates() {
	const batchResponse = {
		grey: await getGreyRates(),
		send: await getSendRates(),
		transferGo: await getTransferGoRates()
	}

	return batchResponse;
}

function getNGNValueFromSend(res) {
	return res.filter(el => el.toCurrencyCode.toLowerCase() === 'ngn')[0]?.exchangeRate;
}

function getNGNValueFromTG(res) {
	const value = res.options?.filter(({isDefault}) => isDefault === true )[0].rate.value
	return Number(value);
}

export function getCBNRates(): Promise<Record<string, number>> {
	return fetchUtil('https://www.cbn.gov.ng/rates/outputExchangeRateJSN.asp?_=1699958900612').then(({data}) => {
		// filter by currency
		const usd = data.filter(el => el.currency.toLowerCase() === 'us dollar');
		const gbp = data.filter(el => el.currency.toLowerCase() === 'pounds sterling');
		const eur = data.filter(el => el.currency.toLowerCase() === 'euro');

		const usdRate = usd[0].sellingrate;
		const eurRate = eur[0].sellingrate;
		const gbpRate = gbp[0].sellingrate;

		return {
			usd: Number(usdRate),
			eur: Number(eurRate),
			gbp: Number(gbpRate)
		}
	}).catch(console.error);
}