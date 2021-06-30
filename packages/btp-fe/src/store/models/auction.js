import { getAuctions, getAuctionDetails, getAvailableAssets } from 'services/btpServices';

const auction = {
  state: {
    auctions: [],
    currentAuction: {},
    availableAssets: [],
  },
  reducers: {
    setAuctionState(state, prop = []) {
      const [property, payload] = prop;
      return {
        ...state,
        [property]: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async getAuctions() {
      try {
        const auctions = await getAuctions();
        this.setAuctionState(['auctions', auctions.content || []]);
        return auctions;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getAuctionDetails(auctionId) {
      try {
        const auction = await getAuctionDetails(auctionId);
        this.setAuctionState(['currentAuction', auction.content]);
        return auction;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getAvailableAssets() {
      try {
        const avalibleAssets = await getAvailableAssets();
        this.setAuctionState(['availableAssets', avalibleAssets.content]);
        return avalibleAssets;
      } catch (error) {
        console.log(error);
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
    selectAvailableAssets() {
      return slice((state) => state.availableAssets);
    },
  }),
};

export default auction;
