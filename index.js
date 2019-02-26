'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {

  // for (var ev in req.body.events) {
  //   console.log('JJWW event[%s], %s ', ev, JSON.stringify(req.body.events[ev]))
  // }
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      console.log("JJWW: 0  " + result)
      res.json(result)

      }
      )
    .catch((err) => {
      console.error("JJWW Error: " + err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  console.log("handleEvent: %s", JSON.stringify(event))

  if (event.type !== 'message' || event.message.type !== 'text' || !event.message.text.startsWith('echo:')) {
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text.substr(5) };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
