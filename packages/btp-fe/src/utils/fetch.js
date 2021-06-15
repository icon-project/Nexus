export const fetchAPI = (endpoint, config = {}) => {
  console.log('endpoint', endpoint);
  const { baseURL, ...rest } = config;
  return fetch(`${baseURL || ''}${endpoint}`, { ...rest, credentials: 'omit' }).then((res) => {
    return res.json();
  });
};
