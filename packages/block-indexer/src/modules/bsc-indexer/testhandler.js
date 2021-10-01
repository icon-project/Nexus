const debugTx = require('debug')('bsc_tx');
const Web3 = require('web3');
const { findLogEventByName, decodeEventLog, bscEventMap } = require('../common/evmlog');

const web3 = new Web3(process.env.BSC_API_URL);

async function testEventHandler(tx, txReceipt, block) {
  const mint = findLogEventByName('CoinMinted', bscEventMap, txReceipt.logs);

  if (mint) {
    const log = decodeEventLog(web3, bscEventMap, 'CoinMinted', mint);
    console.log(web3.utils.hexToUtf8(log.notes));
    debugTx(log);
  }

/*
  bsc_tx Result {
  bsc_tx   '0': '0xa6A2E181b4e981b036aB8A787A3E348ABdfcFc96',
  bsc_tx   '1': '0x61852aA6049336319Cceab16F5796Bcc64fC2348',
  bsc_tx   '2': '1000000',
  bsc_tx   '3': '0x6d6168616d000000000000000000000000000000000000000000000000000000',
  bsc_tx   __length__: 4,
  bsc_tx   from: '0xa6A2E181b4e981b036aB8A787A3E348ABdfcFc96',
  bsc_tx   to: '0x61852aA6049336319Cceab16F5796Bcc64fC2348',
  bsc_tx   amount: '1000000',
  bsc_tx   notes: '0x6d6168616d000000000000000000000000000000000000000000000000000000'
  bsc_tx } +0ms
*/

  const sent = findLogEventByName('CoinSent', bscEventMap, txReceipt.logs);

  if (sent) {
    const log = decodeEventLog(web3, bscEventMap, 'CoinSent', sent);
    debugTx(log);
  }

/*
  bsc_tx Result {
  bsc_tx   '0': '0x61852aA6049336319Cceab16F5796Bcc64fC2348',
  bsc_tx   '1': '0xa6A2E181b4e981b036aB8A787A3E348ABdfcFc96',
  bsc_tx   '2': '1000',
  bsc_tx   '3': '0x666972737420746f6b656e000000000000000000000000000000000000000000',
  bsc_tx   __length__: 4,
  bsc_tx   from: '0x61852aA6049336319Cceab16F5796Bcc64fC2348',
  bsc_tx   to: '0xa6A2E181b4e981b036aB8A787A3E348ABdfcFc96',
  bsc_tx   amount: '1000',
  bsc_tx   notes: '0x666972737420746f6b656e000000000000000000000000000000000000000000'
  bsc_tx } +0ms
*/
}

module.exports = {
  testEventHandler
};
