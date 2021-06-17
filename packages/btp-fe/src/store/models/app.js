import { fetchAPI } from 'utils/fetch';
import { getAuctions, getAuctionDetails } from 'services/btpServices';
const app = {
  state: {
    appInfo: {},
    auctions: [],
    currentAuction: {},
  },
  reducers: {
    setAppInfo(state, payload) {
      return {
        ...state,
        appInfo: payload,
      };
    },
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
  effects: () => ({
    async getAppInfo() {
      try {
        const appInfo = await fetchAPI('/btpnetwork');
        this.setAppInfo(appInfo || {});
        return appInfo;
      } catch (error) {
        console.log(error);
      }
    },
    async getAuctions() {
      try {
        const auctions = await getAuctions();
        this.setAuctions(
          auctions.content && auctions.content.length > 0
            ? auctions.content
            : [
                {
                  id: 'cx97dd9c3e40982bf23ac67b110741323a909a1495_1',
                  name: 'SangDepChai',
                  currentBidAmount: 100,
                  availableBidAmount: 150,
                  endTime: 1623825002306,
                },
              ],
        );
        return auctions;
      } catch (error) {
        console.log(error);
      }
    },
    async getAuctionDetails(auctionId) {
      try {
        const auction = await getAuctionDetails(auctionId);
        this.setAuction(auction.content);
        return auction;
      } catch (error) {
        console.log(error);
      }
    },
  }),
  selectors: (slice) => ({
    selectAppInfo() {
      return slice((state) => state.appInfo);
    },
    selectAuctions() {
      return slice((state) => state.auctions);
    },
    selectCurrentAuction() {
      return slice((state) => state.currentAuction);
    },
  }),
};

export default app;
