import { getRelay } from 'services/btpServices';

const governance = {
  state: {
    relay: {
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
    async getRelay({ page, limit }) {
      try {
        const relay = await getRelay(page, limit);
        this.setGovernanceState(['relay', relay || {}]);
        return relay;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectRelay() {
      return slice((state) => state.relay.content);
    },
    selectTotalRegistered() {
      return slice((state) => state.relay.total);
    },
    selectRegisteredRelayLast24h() {
      return slice((state) => state.relay.registeredLastChange24h);
    },
    selectRewardLast30Days() {
      return slice((state) => state.relayCandidates.rewardChanged30Days);
    },
    selectTotalRewardFund() {
      const getTotalRewardFund = (relays) => {
        if (!relays || relays.length === 0) return 0;
        const totalRewardFund = relays.reduce(
          (total, relay) => total + (relay['monthlyReward'] || 0),
          0,
        );
        return totalRewardFund.toFixed(2);
      };
      return slice((state) => getTotalRewardFund(state.relayCandidates.content));
    },
  }),
};

export default governance;
