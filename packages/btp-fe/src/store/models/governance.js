import { getRelays, getTotalRewardFund } from 'services/btpServices';

const governance = {
  state: {
    relays: {
      content: [],
      total: 0,
      registeredLastChange24h: 0,
    },
    totalRewardFund: {
      totalAmount: 0,
      last30DaysChange: 0,
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
    async getTotalRewardFund() {
      try {
        const totalRewardFund = await getTotalRewardFund();
        const { totalAmount, last30DaysChange } = totalRewardFund.content;
        this.setGovernanceState([
          'totalRewardFund',
          {
            totalAmount,
            last30DaysChange,
          },
        ]);
        return totalRewardFund;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectRelays() {
      return slice((state) => state.relays);
    },
    selectTotalRewardFund() {
      return slice((state) => state.totalRewardFund);
    },
  }),
};

export default governance;
