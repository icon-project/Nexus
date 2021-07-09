import { getRelayCandidates, getRegisteredRelayCandidate } from 'services/btpServices';

const governance = {
  state: {
    relayCandidates: [],
    totalRegistered: '',
  },
  reducers: {
    setRelayCandidates(state, relayCandidates = []) {
      return {
        ...state,
        relayCandidates,
      };
    },
    setTotalRegistered(state, totalRegistered = '') {
      return {
        ...state,
        totalRegistered,
      };
    },
  },
  effects: (dispatch) => ({
    async getRelayCandidates() {
      try {
        const relayCandidates = await getRelayCandidates();
        this.setRelayCandidates(relayCandidates.content || []);
        return relayCandidates;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getTotalRegistered() {
      try {
        const totalRegistered = await getRegisteredRelayCandidate();
        this.setTotalRegistered(totalRegistered.content.count || '');
        return totalRegistered;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectRelayCandidates() {
      return slice((state) => state.relayCandidates);
    },
    selectTotalRegistered() {
      return slice((state) => state.totalRegistered);
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
