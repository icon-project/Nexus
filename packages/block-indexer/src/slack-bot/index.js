/* eslint-disable node/no-path-concat */
// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require('@slack/web-api');
const { createReadStream, writeFileSync, unlinkSync } = require('fs');
const { createLogger } = require('../common');
const { getTransactionIP, updateTransactionIP, createTransactionIP } = require('../modules/transaction-ips/model');
const logger = createLogger();
const { getNameOfTransactionStatus } = require('../common');
const { getNetworkById, getNetworkByToAddress } = require('../modules/networks/model');
const _ = require('lodash');

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
    const transaction = await getTransactionIP(txHash, networkId);
    if (!transaction) {
      // if block-indexer can not get ip, it create a record in transaction_ips. When dashboard-api receive client'ip and transaction hash, it will send to slack
      await createTransactionIP(txHash, networkId, false, data);
    } else {
      // 0. get user's ip from transaction
      const ip = _.get(transaction, 'ip', null);
      const sentToSlack = _.get(transaction, 'sentToSlack', true);
      // if block-indexer got ip and the notification has not been sent yet => Send to slack
      if (ip && sentToSlack === false) {
        data.user_ip_addr = ip;
        const logFileName = `${process.env.SLACK_REPORT_FILE_NAME_RREFIX}[${(new Date()).toISOString()}][${ip}].log`;
        // send to slack
        await sendToSlack(data, logFileName);
        // update sending status (sent_to_slack = true)
        await updateTransactionIP(txHash, networkId, true, data);
      }
    }
  } catch (error) {
    logger.error(error);
  }
}

const sendToSlack = async (data, logFileName) => {
  try {
    // 1. write log file
    writeFileSync(`${__dirname}/${logFileName}`, JSON.stringify(data));
    // 2. Upload to slack
    await client.files.upload({
      channels: process.env.SLACK_CHANNEL_ID,
      initial_comment: '',
      file: createReadStream(path.resolve(__dirname, logFileName))
    });
    // 3. remove log file
    unlinkSync(`${__dirname}/${logFileName}`);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  logTxHashToSlack
};
