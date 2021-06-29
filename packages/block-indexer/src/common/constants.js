// For result code of handled service Ref https://git.baikal.io/icon/btp/-/blob/develop/pyscore/token_bsh/token_bsh.py#L78
const RESULT_CODE = {
  RC_OK: 0,
  RC_ERR_UNREGISTERED_TOKEN: -1
};

const TRANSACTION_TBL_NAME = 'transactions';

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
  blockTime: 'block_time',
  networkId: 'network_id',
  confirmed: 'confirmed',
  createAt: 'create_at',
  updateAt: 'update_at',
  deleteAt: 'delete_at'
};

module.exports = {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  RESULT_CODE
};

