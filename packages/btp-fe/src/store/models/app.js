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
  effects: (dispatch) => ({
    async getAppInfo() {
      try {
        const appInfo = await fetchAPI('/btpnetwork');
        this.setAppInfo(appInfo || {});
        return appInfo;
      } catch (error) {
        dispatch.modal.handleError();
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
