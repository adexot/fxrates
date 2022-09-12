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
