export const fetchAPI = (endpoint, config = {}) => {
  const { baseURL, ...rest } = config;
  return fetch(`${baseURL || ''}${endpoint}`, { ...rest, credentials: 'omit' }).then((res) => {
    return res.json();
  });
};
