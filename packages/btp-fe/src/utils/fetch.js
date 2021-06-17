export const fetchAPI = (endpoint, config = {}) => {
  const { baseURL, ...rest } = config;
  return fetch(`${baseURL || process.env.REACT_APP_BTP_ENDPOINT}${endpoint}`, {
    ...rest,
    credentials: 'omit',
  }).then((res) => {
    return res.json();
  });
};
