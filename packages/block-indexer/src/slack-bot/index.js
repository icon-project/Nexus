/* eslint-disable node/no-path-concat */
// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require('@slack/web-api');
const { createReadStream, writeFileSync, unlinkSync } = require('fs');
const { createLogger } = require('../common');
const { retryGetTransactionIP } = require('../modules/transaction-ips/model');
const logger = createLogger();
const { getNameOfTransactionStatus } = require('../common');
const { getNetworkById, getNetworkByToAddress } = require('../modules/networks/model');

const path = require('path');
// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.SLACK_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
  teamId: process.env.SLACK_TEAM_ID
});

async function logTxHashToSlack(toAddress, fromAddress, txHash, blockTime, btpFee, networkFee, status, value, networkId) {
  const data = {
    transaction_hash: txHash,
    amount: Number(value),
    status: await getNameOfTransactionStatus(status),
    time: new Date(Number(blockTime)),
    from_network: (await getNetworkById(networkId)).name,
    to_network: (await getNetworkByToAddress(toAddress)).name,
    from_addr: fromAddress,
    to_addr: toAddress,
    network_fee: Number(networkFee),
    btp_fee: Number(btpFee),
    user_ip_addr: null
  };

  try {
    // 0. get user's ip from transaction
    const ip = await retryGetTransactionIP(txHash, networkId);
    data.user_ip_addr = ip;
    const logFileName = `${process.env.SLACK_REPORT_FILE_NAME_RREFIX}[${(new Date()).toISOString()}][${ip}].log`;
    // 1. write log file
    writeFileSync(`${__dirname}/${logFileName}`, JSON.stringify(data));
    const result = await client.files.upload({
      channels: process.env.SLACK_CHANNEL_ID,
      initial_comment: '',
      file: createReadStream(path.resolve(__dirname, logFileName))
    });
    // 2. remove log file
    unlinkSync(`${__dirname}/${logFileName}`);
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  logTxHashToSlack
};
