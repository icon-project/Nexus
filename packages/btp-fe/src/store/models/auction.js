// import { getAuctions, getAuctionDetails, getFeeAssets } from 'services/btpServices';
import { getAuctions, getFeeAssets } from 'services/btpServices';

const auction = {
  state: {
    auctions: [],
    currentAuction: {},
    fees: [],
    bids: {},
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
    setBids(state, bids = {}) {
      return {
        ...state,
        bids,
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
    async getAuctionDetails() {
      try {
        // const auction = await getAuctionDetails(auctionId);
        this.setAuction({
          name: 'Test2206',
          topBidder: 'hx774ca45c762872ac6dd4780784e279ceb389dec9',
          currentBidAmount: 100,
          availableBidAmount: 20,
          createdTime: '2021-06-22T00:04:02.161Z',
          endTime: '2021-06-22T00:08:48.932Z',
        });
        // return auction;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getBids(pageIndex) {
      try {
        if (pageIndex === 1) {
          this.setBids({
            content: [
              {
                id: 'e81de1f45f',
                bidder: 'hxf929970f97646433610c5b7367e12bb5bd1cab58',
                amount: 130,
                createdTime: '2021-06-15T23:26:14.188Z',
              },
              {
                id: '3c7ecde75e',
                bidder: 'hxfafd853a7b47be47aa19acfb60e730e476fad2ab',
                amount: 110,
                createdTime: '2021-06-15T23:25:43.884Z',
              },
              {
                id: '3c7ecde75e1',
                bidder: 'hxfafd853a7b47be47aa19acfb60e730e476fad2ab',
                amount: 110,
                createdTime: '2021-06-15T23:25:43.884Z',
              },
              {
                id: '3c7ecde75e2',
                bidder: 'hxfafd853a7b47be47aa19acfb60e730e476fad2ab',
                amount: 110,
                createdTime: '2021-06-15T23:25:43.884Z',
              },
              {
                id: '3c7ecde75e3',
                bidder: 'hxfafd853a7b47be47aa19acfb60e730e476fad2ab',
                amount: 110,
                createdTime: '2021-06-15T23:25:43.884Z',
              },
            ],
            metadata: {
              pagination: {
                limit: 6,
                offset: 2,
                totalItem: 6,
              },
            },
          });
        } else {
          this.setBids({
            content: [
              {
                id: 'e81de1f45f',
                bidder: 'qwqe',
                amount: 130,
                createdTime: '2021-06-15T23:26:14.188Z',
              },
              {
                id: '3c7ecde75e',
                bidder: 'rter',
                amount: 110,
                createdTime: '2021-06-15T23:25:43.884Z',
              },
              {
                id: '3c7ecde75e1',
                bidder: 'yut',
                amount: 110,
                createdTime: '2021-06-15T23:25:43.884Z',
              },
              {
                id: '3c7ecde75e2',
                bidder: 'ui',
                amount: 110,
                createdTime: '2021-06-15T23:25:43.884Z',
              },
              {
                id: '3c7ecde75e3',
                bidder: 'uiy',
                amount: 110,
                createdTime: '2021-06-15T23:25:43.884Z',
              },
            ],
            metadata: {
              pagination: {
                limit: 6,
                offset: 2,
                totalItem: 6,
              },
            },
          });
        }
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
    selectBids() {
      return slice((state) => state.bids.content || []);
    },
    selectPagination() {
      return slice((state) => state.bids.metadata?.pagination || {});
    },
  }),
};

export default auction;
