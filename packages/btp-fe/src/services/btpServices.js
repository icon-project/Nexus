import { fetchAPI } from 'utils/fetch';

export const getAuctions = () => {
  return fetchAPI('/auctions');
};

export const getAuctionDetails = (auctionId) => {
  return fetchAPI(`/auctions/${auctionId}`);
};

export const getAuctionBids = (auctionId, offset, limit = 10) => {
  return fetchAPI(`/auctions/${auctionId}/bids?limit=${limit}&offset=${offset}`);
};

export const getAvailableAssets = () => {
  return fetchAPI(`/auctions/?availableAssets=1`);
};

export const getFeeAssets = () => {
  return fetchAPI(`/fees`);
};

export const getRelayCandidates = () => {
  return fetchAPI(`/relays`);
};

export const getRegisteredRelayCandidate = () => {
  return fetchAPI(`/relays?style=count`);
};

export const getConnectedNetworks = () => {
  return fetchAPI(`/networks`);
};

export const getNetwork = (id) => {
  return fetchAPI(`/networks/${id}`);
};

export const getTransferHistory = (page) => {
  return fetchAPI(`/transactions?page=${page}`);
};
