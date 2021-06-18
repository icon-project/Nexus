import { fetchAPI } from 'utils/fetch';

const app = {
  state: {
    appInfo: {},
  },
  reducers: {
    setAppInfo(state, payload) {
      return {
        ...state,
        appInfo: payload,
      };
    },
  },
  effects: () => ({
    async getAppInfo() {
      try {
        const appInfo = await fetchAPI('/btpnetwork');
        this.setAppInfo(appInfo || {});
        return appInfo;
      } catch (error) {
        console.log(error);
      }
    },
  }),
  selectors: (slice) => ({
    selectAppInfo() {
      return slice((state) => state.appInfo);
    },
  }),
};

export default app;
