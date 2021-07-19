// For result code of handled service Ref https://git.baikal.io/icon/btp/-/blob/develop/pyscore/token_bsh/token_bsh.py#L78
const RESULT_CODE = {
  RC_OK: 0,
  RC_ERR_UNREGISTERED_TOKEN: -1,
};
// Refer https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions
const CURRENCY_IDs = {
  USD: 2781,
  VND: 2823,
};
const CURRENCIES = {
  USD: 'USD',
  VND: 'VND',
};
const COINs = {
  BITCOIN: 'BTC',
  ICON: 'ICX',
  BINANCE: 'BNB',
};

const TRANSACTION_TBL_NAME = 'transactions';
const NETWORK_TBL_NAME = 'networks';
const RELAY_REWARD_TBL_NAME = 'relay_rewards';

const TRANSACTION_TBL = {
  id: 'id',
  fromAddress: 'from_address',
  tokenName: 'token_name',
  serialNumber: 'serial_number',
  value: 'value',
  toAddress: 'to_address',
  blockHeight: 'block_height',
  blockHash: 'block_hash',
  txHash: 'tx_hash',
  status: 'status',
  networkId: 'network_id',
  blockTime: 'block_time',
  btpFee: 'btp_fee',
  networkFee: 'network_fee',
  totalVolume: 'total_volume',
  createAt: 'create_at',
  updateAt: 'update_at',
  deleteAt: 'delete_at',
};

const RELAY_REWARD_TBL = {
  id: 'id',
  relayIdd: 'relay_id',
  rewardValue: 'reward_value',
  createdTime: 'created_time',
  updatedTime: 'updated_time',
};

const ICX_LOOP_UNIT = 10 ** 18;

module.exports = {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  RESULT_CODE,
  NETWORK_TBL_NAME,
  RELAY_REWARD_TBL_NAME,
  RELAY_REWARD_TBL,
  CURRENCY_IDs,
  CURRENCIES,
  COINs,
  ICX_LOOP_UNIT,
};
