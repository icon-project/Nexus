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
const REGISTERED_TOKENS_TABLE = 'registered_tokens';

const BLOCK_INDEXER_STOPPED = (lastBlock, indexerName) => `🐛 *${indexerName}*-indexer was \`STOPPED\` at block \`${lastBlock}\` 🚫`;
const BLOCK_INDEXER_HEALTHY = (lastBlock, indexerName) => `🎉 *${indexerName}*-indexer is good ✅`;

const TRANSACTION_TBL = {
  id: 'id',
  fromAddress: 'from_address',
  tokenName: 'token_name',
  serialNumber: 'serial_number',
  value: 'value',
  toAddress: 'to_address',
  txHash: 'tx_hash',
  status: 'status',
  networkId: 'network_id',
  blockTime: 'block_time',
  btpFee: 'btp_fee',
  networkFee: 'network_fee',
  totalVolume: 'total_volume',
  createAt: 'create_at',
  updateAt: 'update_at'
};

const ICX_LOOP_UNIT = 10 ** 18;

module.exports = {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  RESULT_CODE,
  NETWORK_TBL_NAME,
  CURRENCY_IDs,
  CURRENCIES,
  COINs,
  ICX_LOOP_UNIT,
  REGISTERED_TOKENS_TABLE,
  BLOCK_INDEXER_STOPPED,
  BLOCK_INDEXER_HEALTHY
};
