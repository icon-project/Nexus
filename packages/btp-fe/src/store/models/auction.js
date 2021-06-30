import { getAuctions, getAuctionDetails, getFeeAssets } from 'services/btpServices';

const auction = {
  state: {
    auctions: [],
    currentAuction: {},
    fees: [],
  },
  reducers: {
    setAuctions(state, auctions = []) {
      return {
        ...state,
        auctions,
      };
    },
    setAuction(state, auction = {}) {
      return {
        ...state,
        currentAuction: auction,
      };
    },
    setFees(state, fees = []) {
      return {
        ...state,
        fees,
      };
    },
  },
  effects: (dispatch) => ({
    async getAuctions() {
      try {
        const auctions = await getAuctions();
        this.setAuctions(auctions.content || []);
        return auctions;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getAuctionDetails(auctionId) {
      try {
        const auction = await getAuctionDetails(auctionId);
        this.setAuction(auction.content);
        return auction;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getFees() {
      try {
        const fees = await getFeeAssets();
        this.setFees(fees.content.assets);
        return fees;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectAuctions() {
      return slice((state) => state.auctions);
    },
    selectCurrentAuction() {
      return slice((state) => state.currentAuction);
    },
    selectFees() {
      return slice((state) => state.fees);
    },
  }),
};

export default auction;
