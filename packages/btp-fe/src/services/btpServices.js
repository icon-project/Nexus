import { fetchAPI } from 'utils/fetch';

export const getAuctions = () => {
  return fetchAPI('/auctions');
};

export const getAuctionDetails = (auctionId) => {
  return fetchAPI(`/auctions/${auctionId}`);
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
