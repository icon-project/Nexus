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

export const getNetwork = (id) => {
  return fetchAPI(`/networks/${id}`);
};

export const getTransferHistory = (page) => {
  return fetchAPI(`/transactions?page=${page}`);
};
export const tokenToUsd = async (token, amount) => {
  return fetchAPI(`/btpnetwork/converter?token=${token}&amount=${amount}&convert_to=usd`);
};
