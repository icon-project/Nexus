import { getAuctions, getAuctionDetails } from 'services/btpServices';

const auction = {
  state: {
    auctions: [],
    currentAuction: {},
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
  }),
  selectors: (slice) => ({
    selectAuctions() {
      return slice((state) => state.auctions);
    },
    selectCurrentAuction() {
      return slice((state) => state.currentAuction);
    },
  }),
};

export default auction;
