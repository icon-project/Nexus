import { getAuctions, getAuctionDetails } from 'services/btpServices';

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
        // const avalibleAssets = await getAvailableAssets();
        setTimeout(() => {
          this.setAuctionState([
            'availableAssets',
            [
              {
                name: 'SampleToken1406',
                value: 40,
              },
              {
                name: 'Test2206',
                value: 10,
              },
              {
                name: 'SunnyDay',
                value: 10,
              },
            ],
          ]);
        }, 1000);
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
