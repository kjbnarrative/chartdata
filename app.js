const MY_API_KEY = 'f25542717b30f54a03117026f0c22f8d1266ab0e';

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const webSocket = new WebSocket(
    `wss://realtime-api.defined.fi/graphql`,
  "graphql-transport-ws"
);


const app = express();
const port = process.env.PORT || 3000;

webSocket.onopen = () => {
    console.log("opened");
    webSocket.send(
      JSON.stringify({
        "type": "connection_init",
        "payload": {
          "Authorization": MY_API_KEY
        }
      })
    );
  };

webSocket.onmessage = (event) => {
    console.log(event);
    const data = JSON.parse(event.data)
    if (data.type === "connection_ack") {
      webSocket.send(
        JSON.stringify(
          {
            id: "my_id",
            type: "subscribe",
            payload: {
              "variables": {
                "id": "0x28b3d0d4b39fefd3008500b57a1357a87573ada3:1",
                "quoteToken": "token0"
              },
              "extensions": {},
              "operationName": "CreateEvents",
              "query": "subscription CreateEvents($id: String, $quoteToken: QuoteToken) {\n  onEventsCreated(id: $id, quoteToken: $quoteToken) {\n    address\n    id\n    networkId\n    events {\n      address\n      baseTokenPrice\n      blockNumber\n      eventDisplayType\n      eventType\n      id\n      liquidityToken\n      logIndex\n      maker\n      timestamp\n      token0ValueBase\n      token1ValueBase\n      transactionHash\n      transactionIndex\n      quoteToken\n      labels {\n        sandwich {\n          label\n          sandwichType\n          token0DrainedAmount\n          token1DrainedAmount\n          __typename\n        }\n        __typename\n      }\n      data {\n        __typename\n        ... on BurnEventData {\n          amount0\n          amount1\n          amount0Shifted\n          amount1Shifted\n          type\n          __typename\n        }\n        ... on MintEventData {\n          amount0\n          amount1\n          amount0Shifted\n          amount1Shifted\n          type\n          __typename\n        }\n        ... on SwapEventData {\n          amount0In\n          amount0Out\n          amount1In\n          amount1Out\n          amount0\n          amount1\n          amountNonLiquidityToken\n          priceUsd\n          priceUsdTotal\n          priceBaseToken\n          priceBaseTokenTotal\n          type\n          __typename\n        }\n      }\n      __typename\n    }\n    __typename\n  }\n}"
            }
          }
        )
      );
    } else {
      console.log("message", data);
    }
  };

// Define a route to fetch a token
app.get('/fetch-token', async (req, res) => {
  try {
    // do somethings


  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
