import { getConnectedNetworks, getNetwork } from 'services/btpServices';

const network = {
  state: {
    networks: [],
    networkDetails: [],
  },
  reducers: {
    setNetworks(state, networks = []) {
      return {
        ...state,
        networks,
      };
    },
    setNetworkDetails(state, networkDetails = []) {
      return {
        ...state,
        networkDetails,
      };
    },
  },
  effects: (dispatch) => ({
    async getNetworks(params = {}, globalState) {
      const hasData = globalState.network.networks.length > 0;
      const { cache = false } = params;

      if (!cache || (cache && !hasData)) {
        try {
          const networks = await getConnectedNetworks();
          this.setNetworks(networks.content.networks || []);
          return networks;
        } catch (error) {
          dispatch.modal.handleError(error);
        }
      }
    },
    async getNetworkDetails(id) {
      try {
        const network = await getNetwork(id);
        this.setNetworkDetails(network.content.network);
        return network;
      } catch (error) {
        dispatch.modal.handleError(error);
      }
    },
  }),
  selectors: (slice) => ({
    selectNetwotks() {
      return slice((state) => state.networks);
    },
    selectNetworkDetails() {
      return slice((state) => state.networkDetails);
    },
  }),
};

export default network;
