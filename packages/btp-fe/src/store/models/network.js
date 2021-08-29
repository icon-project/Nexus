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
    async getNetworks() {
      try {
        const networks = await getConnectedNetworks();
        this.setNetworks(networks.content.networks || []);
        return networks;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getNetworkDetails(id) {
      try {
        const network = await getNetwork(id);
        this.setNetworkDetails(network.content.network);
        return network;
      } catch (error) {
        dispatch.modal.handleError();
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
