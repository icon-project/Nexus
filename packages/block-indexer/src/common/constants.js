const TRANSACTION_STATUS = {
  success: 1,
  failed: -1,
  pending: 0,
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
  createAt: 'create_at',
  updateAt: 'update_at'
};

const ICX_LOOP_UNIT = 10 ** 18;

const CONTRACT_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const MINT_EVENT = 'mint';
const BURN_EVENT = 'burn';
const ADD_RELAY_ACTION = 'addRelay';
const REMOVE_RELAY_ACTION = 'removeRelay';

module.exports = {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  TRANSACTION_STATUS,
  ICX_LOOP_UNIT,
  CONTRACT_ZERO_ADDRESS,
  MINT_EVENT,
  BURN_EVENT,
  ADD_RELAY_ACTION,
  REMOVE_RELAY_ACTION
};
