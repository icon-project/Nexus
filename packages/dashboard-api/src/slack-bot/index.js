// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require('@slack/web-api');
const { createReadStream, writeFileSync, unlinkSync } = require('fs');
const { logger } = require('../common');

const path = require('path');
// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.SLACK_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
  teamId: process.env.SLACK_TEAM_ID
});

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
  sendToSlack
};
