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
