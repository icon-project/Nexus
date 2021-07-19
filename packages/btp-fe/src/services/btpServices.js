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

export const getRegisteredRelayLast24h = () => {
  return fetchAPI(`/relays?style=registeredLast24h`);
};

export const getConnectedNetworks = () => {
  return fetchAPI(`/networks`);
};

export const getNetwork = (id) => {
  return fetchAPI(`/networks/${id}`);
};

// transactions?page=<page>&limit=<limit>&from=<network_id>&to=<network_id> / default limit: 20
export const getTransferHistory = (page, limit = 20) => {
  return fetchAPI(`/transactions?page=${page}&limit=${limit}`);
};

export const getTransferHistoryById = (id) => {
  return fetchAPI(`/transactions/${id}`);
};

export const tokenToUsd = async (token, amount) => {
  return fetchAPI(`/btpnetwork/converter?token=${token}&amount=${amount}&convert_to=usd`);
};
