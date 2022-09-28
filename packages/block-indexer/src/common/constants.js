const TRANSACTION_STATUS = {
  success: 1,
  failed: -1,
  pending: 0
};

const TRANSACTION_TBL_NAME = 'transactions';

const TRANSACTION_TBL = {
  fromAddress: 'from_address',
  tokenName: 'token_name',
  serialNumber: 'serial_number',
  value: 'value',
  toAddress: 'to_address',
  txHash: 'tx_hash',
  blockTime: 'block_time',
  networkId: 'network_id',
  btpFee: 'btp_fee',
  networkFee: 'network_fee',
  status: 'status',
  totalVolume: 'total_volume',
  wpsData: 'wps_data',
  createAt: 'create_at',
  updateAt: 'update_at'
};

const ICX_LOOP_UNIT = 10 ** 18;
const NEAR_LOOP_UNIT = 10 ** 24;
const CONTRACT_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ICON_ZERO_ADDRESS = 'hx0000000000000000000000000000000000000000';
const MINT_EVENT = 'mint';
const BURN_EVENT = 'burn';
const TRANSFER_START_EVENT = 'TransferStart';
const TRANSFER_END_EVENT = 'TransferEnd';
const BUY_TOKEN_EVENT = 'BuyTokenEvent';
const BUY_TOKEN_END_EVENT = 'BuyTokenEndEvent';
const TRANSFER_SINGLE_EVENT = 'TransferSingle';
const ADD_RELAY_ACTION = 'addRelay';
const REMOVE_RELAY_ACTION = 'removeRelay';
const TOKEN_REGISTERED_EVENT = 'register';
const BLOCK_INDEXER_STOPPED = (lastBlock, indexerName) => `🐛 *${indexerName}*-indexer was \`STOPPED\` at block \`${lastBlock}\` 🚫`;
const BLOCK_INDEXER_HEALTHY = (lastBlock, indexerName) => `🎉 *${indexerName}*-indexer is good ✅`;

module.exports = {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  TRANSACTION_STATUS,
  ICX_LOOP_UNIT,
  NEAR_LOOP_UNIT,
  CONTRACT_ZERO_ADDRESS,
  ICON_ZERO_ADDRESS,
  MINT_EVENT,
  BURN_EVENT,
  TRANSFER_START_EVENT,
  TRANSFER_END_EVENT,
  TRANSFER_SINGLE_EVENT,
  ADD_RELAY_ACTION,
  REMOVE_RELAY_ACTION,
  BUY_TOKEN_EVENT,
  BUY_TOKEN_END_EVENT,
  TOKEN_REGISTERED_EVENT,
  BLOCK_INDEXER_STOPPED,
  BLOCK_INDEXER_HEALTHY
};
