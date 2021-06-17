// For result code of handled service Ref https://git.baikal.io/icon/btp/-/blob/develop/pyscore/token_bsh/token_bsh.py#L78
const RESULT_CODE = {
  RC_OK: 0,
  RC_ERR_UNREGISTERED_TOKEN: -1,
};

const TRANSACTION_TBL_NAME = 'transactions';
const NETWORK_TBL_NAME = 'networks';

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
  confirmed: 'confirmed',
  createAt: 'create_at',
  updateAt: 'update_at',
  deleteAt: 'delete_at',
};

const NETWORKS_CONNECTED_ICON_TBL_NAME = 'networks_connected_icon';
const NETWORKS_CONNECTED_ICON_TBL = {
  id: 'id',
  nid: 'nid',
  networkName: 'network_name',
  logo: 'logo',
  volume24h: 'volume_24h',
  volumeAllTime: 'volume_all_time',
  mint_fee: 'mint_fee',
  burn_fee: 'burn_fee',
  createAt: 'create_at',
  updateAt: 'update_at',
  deleteAt: 'delete_at',
}


const NETWORKS_TBL = {
  id: 'id',
  name: 'name',
  path: 'path',
  url: 'url'
}
const NUMBER_NETWORK = 4

module.exports = {
  TRANSACTION_TBL_NAME,
  TRANSACTION_TBL,
  RESULT_CODE,
  NETWORK_TBL_NAME,
  NETWORKS_TBL,
  NETWORKS_CONNECTED_ICON_TBL,
  NETWORKS_CONNECTED_ICON_TBL_NAME,
};


