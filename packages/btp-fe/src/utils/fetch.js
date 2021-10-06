export const fetchAPI = (endpoint, config = {}) => {
  const { baseURL, ...rest } = config;
  return fetch(`${baseURL || process.env.REACT_APP_BTP_ENDPOINT}${endpoint}`, {
    ...rest,
    credentials: 'omit',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((error) => {
      throw error;
    });
};
