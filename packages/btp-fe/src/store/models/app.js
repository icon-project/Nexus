import { fetchAPI } from 'utils/fetch';

const app = {
  state: {
    appInfo: {
      content: {
        minted: [],
      },
    },
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
    selectConnectedNetworks() {
      return slice((state) => {
        return state.appInfo.content.minted.reduce(
          (accumulator, { networkId, networkName, mintedVolume }) => ({
            ...accumulator,
            [networkId]: { name: networkName, value: networkId, mintedVolume },
          }),
          {},
        );
      });
    },
  }),
};

export default app;
