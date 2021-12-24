const line = require('@line/bot-sdk');
const config = require('../.env.json');

const client = new line.Client({
  channelAccessToken: config.channel.token
});

module.exports  = client;
