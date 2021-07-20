import { getRelayCandidates, getRegisteredRelayLast24h } from 'services/btpServices';

const governance = {
  state: {
    relayCandidates: [],
    totalRegisteredLast24h: 0,
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
    async getRelayCandidates() {
      try {
        const relayCandidates = await getRelayCandidates();
        this.setGovernanceState(['relayCandidates', relayCandidates.content || []]);
        return relayCandidates;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getRegisteredRelayLast24h() {
      try {
        const totalRegisteredLast24h = await getRegisteredRelayLast24h();
        this.setGovernanceState([
          'totalRegisteredLast24h',
          totalRegisteredLast24h?.content.last24hChange || 0,
        ]);
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectRelayCandidates() {
      return slice((state) => state.relayCandidates);
    },
    selectRegisteredRelayLast24h() {
      return slice((state) => state.totalRegisteredLast24h);
    },
    selectTotalRewardFund() {
      const getTotalRewardFund = (relays) => {
        if (relays.length === 0) return 0;
        const totalRewardFund = relays.reduce(
          (total, relay) => total + (relay['monthlyReward'] || 0),
          0,
        );
        return totalRewardFund.toFixed(2);
      };
      return slice((state) => getTotalRewardFund(state.relayCandidates));
    },
  }),
};

export default governance;
