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
    const data = JSON.parse(event.data);
    
    // console.log('msg' + JSON.parse(data.payload));
    if (data.type === "connection_ack") {
      webSocket.send(
        JSON.stringify(
          {
            id: "my_subscription",
            type: "subscribe",
            payload: {
              "variables": {
                "pairId": "0x839e2d728bfead41fc642a0ec4132b33ebb09d11:1"
              },
              "extensions": {},
              "operationName": "OnBarsUpdated",
              "query": "subscription OnBarsUpdated($pairId: String!) { onBarsUpdated(pairId: $pairId) { pairAddress timestamp networkId aggregates { r1 { t usd { t o h l c volume } token { t o h l c volume } } } } }", 
            }
          }
        )
      );
    } else {
      console.log("message", data);
      console.log('payload ', data.payload);
      console.log('aggregates ', data.payload.data.onBarsUpdated.aggregates);
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
