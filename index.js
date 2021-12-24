const express = require('express');
const app = express();
const mongoose = require('mongoose');
const webhook = require('./webhook');
const config = require('./.env.json');

app.use(express.json());
app.use(express.urlencoded())
app.use('/webhook', webhook);

app.listen(config.server.port,async () => {
    await mongoose.connect(`mongodb://${config.db.url}:${config.db.port}/${config.db.schema}`);
    console.log(`listen on port ${config.server.port}`);
});
