import { getRelays } from 'services/btpServices';

const governance = {
  state: {
    relays: {
      content: [],
      total: 0,
      registeredLastChange24h: 0,
    },
  },
  reducers: {
    setGovernanceState(state, prop = []) {
      const [property, payload] = prop;
      return {
        ...state,
        [property]: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async getRelays({ page, limit }) {
      try {
        const relays = await getRelays(page, limit);
        this.setGovernanceState(['relays', relays || {}]);
        return relays;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectRelays() {
      return slice((state) => state.relays);
    },
  }),
};

export default governance;
