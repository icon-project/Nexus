import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { hashShortener } from 'utils/app';

import {
  getAuctions,
  getAuctionDetails,
  getAvailableAssets,
  getFeeAssets,
  getAuctionBids,
} from 'services/btpServices';

const auction = {
  state: {
    auctions: [],
    currentAuction: {},
    availableAssets: [],
    fees: { assets: [], totalFeeInUsd: 0 },
    bids: {},
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
        this.setAuctionState(['currentAuction', auction.content || {}]);
        return auction;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getBids({ pageIndex, auctionId }) {
      try {
        // offset is default 0 = first page
        const bids = await getAuctionBids(auctionId, pageIndex - 1);
        this.setAuctionState(['bids', bids]);
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
    async getAvailableAssets() {
      try {
        const availableAssets = await getAvailableAssets();
        this.setAuctionState(['availableAssets', availableAssets.content]);
        return availableAssets;
      } catch (error) {
        console.log(error);
      }
    },
    async getFees() {
      try {
        const fees = await getFeeAssets();
        this.setAuctionState(['fees', fees.content]);
        return fees;
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectAuctions() {
      return slice((state) =>
        state.auctions.map((d) => {
          const { id, endTime, ...ots } = d;
          return {
            ...ots,
            id,
            shortedId: hashShortener(id),
            endTime: dayjs(endTime).fromNow(true) + ' left',
          };
        }),
      );
    },
    selectCurrentAuction() {
      return slice(({ currentAuction }) => {
        if (Object.keys(currentAuction).length === 0) return currentAuction;
        const { createdTime, endTime, topBidder, ...ots } = currentAuction;
        return {
          ...ots,
          createdTime: dayjs(createdTime).format('DD/MM/YYYY'),
          endTime: dayjs(endTime).format('DD/MM/YYYY'),
          topBidder: hashShortener(topBidder),
        };
      });
    },
    selectAvailableAssets() {
      return slice((state) => state.availableAssets.map(({ name }) => ({ name, value: name })));
    },
    selectFees() {
      return slice((state) => state.fees);
    },
    selectBids() {
      return slice((state) =>
        (state.bids.content || []).map((bid) => {
          return {
            ...bid,
            bidder: hashShortener(bid.bidder),
            createdTime: dayjs(bid.createdTime).fromNow(),
          };
        }),
      );
    },
    selectPagination() {
      return slice((state) => state.bids.metadata?.pagination || {});
    },
  }),
};

export default auction;
