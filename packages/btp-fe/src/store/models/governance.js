import { getRelayCandidates, getRegisteredRelayLast24h } from 'services/btpServices';

const governance = {
  state: {
    relayCandidates: {
      content: [],
      rewardChanged30Days: 0,
    },
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
        if (!relayCandidates.error) {
          this.setGovernanceState(['relayCandidates', relayCandidates || {}]);
        }
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
      return slice((state) => state.relayCandidates.content);
    },
    selectRewardLast30Days() {
      return slice((state) => state.relayCandidates.rewardChanged30Days);
    },
    selectRegisteredRelayLast24h() {
      return slice((state) => state.totalRegisteredLast24h);
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
