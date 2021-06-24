import { getConnectedNetworks } from 'services/btpServices';

const network = {
  state: {
    networks: [],
  },
  reducers: {
    setNetworks(state, networks = []) {
      return {
        ...state,
        networks,
      };
    },
  },
  effects: (dispatch) => ({
    async getNetworks() {
      try {
        const networks = await getConnectedNetworks();
        this.setNetworks(networks.content.networks || []);
        return networks;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectNetwotks() {
      return slice((state) => state.networks);
    },
  }),
};

export default network;
