import { fetchAPI } from 'utils/fetch';

const baseAuctionURL = '/auctions';
const baseRelayURL = '/relays';
const baseBTPNetwork = '/btpnetwork';

export const getAuctions = () => {
  return fetchAPI(baseAuctionURL);
};

export const getAuctionDetails = (auctionId) => {
  return fetchAPI(`${baseAuctionURL}/${auctionId}`);
};

export const getAuctionBids = (auctionId, offset, limit = 10) => {
  return fetchAPI(`${baseAuctionURL}/${auctionId}/bids?limit=${limit}&offset=${offset}`);
};

export const getAvailableAssets = () => {
  return fetchAPI(`${baseAuctionURL}/?availableAssets=1`);
};

export const getFeeAssets = () => {
  return fetchAPI(`/fees`);
};

export const getAvailableAmountLast24h = () => {
  return fetchAPI(`/fees/?availableAmountLast24h=1`);
};

export const getRelayCandidates = () => {
  return fetchAPI(`${baseRelayURL} + '?style=list&rewardLast30Days=1`);
};

export const getRegisteredRelayCandidate = () => {
  return fetchAPI(`${baseRelayURL}?style=count`);
};

export const getRegisteredRelayLast24h = () => {
  return fetchAPI(`${baseRelayURL}?style=registeredLast24h`);
};

export const getConnectedNetworks = () => {
  return fetchAPI(`/networks`);
};

export const getNetwork = (id) => {
  return fetchAPI(`/networks/${id}`);
};

export const getTransferHistory = (page, limit = 20, assetName, from, to) => {
  return fetchAPI(
    `/transactions?page=${page}&limit=${limit}&assetName=${assetName}&from=${from}&to=${to}`,
  );
};

export const getTransferHistoryById = (id) => {
  return fetchAPI(`/transactions/${id}`);
};

export const tokenToUsd = async (token, amount) => {
  return fetchAPI(`${baseBTPNetwork}/converter?token=${token}&amount=${amount}&convert_to=usd`);
};
