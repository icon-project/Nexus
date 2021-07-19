import { fetchAPI } from 'utils/fetch';

const app = {
  state: {
    appInfo: {
      content: {
        minted: [],
      },
    },
    volumeChangeLast24h: 0,
  },
  reducers: {
    setAppState(state, prop = []) {
      const [property, payload] = prop;
      return {
        ...state,
        [property]: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async getAppInfo() {
      try {
        const appInfo = await fetchAPI('/btpnetwork?availableAmountLast24h=1');
        this.setAppState(['appInfo', appInfo || {}]);
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
        return state.appInfo?.content?.minted.reduce(
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
