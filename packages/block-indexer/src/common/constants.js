const TRANSACTION_STATUS = {
  success: 1,
  failed: -1,
  pending: 0,
};

const TRANSACTION_TBL_NAME = 'transactions';

const TRANSACTION_TBL = {
  id: 'id',
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

module.exports = {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  TRANSACTION_STATUS,
  ICX_LOOP_UNIT,
};
