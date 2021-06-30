import { fetchAPI } from 'utils/fetch';

export const getAuctions = () => {
  return fetchAPI('/auctions');
};

export const getAuctionDetails = (auctionId) => {
  return fetchAPI(`/auctions/${auctionId}`);
};

export const getAvailableAssets = () => {
  return fetchAPI(`/auctions/?availableAssets=1`);
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

export const getTransferHistory = (page) => {
  return fetchAPI(`/transactions?page=${page}`);
};
