const MY_API_KEY = 'f25542717b30f54a03117026f0c22f8d1266ab0e';

const express = require('express');
const { Defined } = require('@definedfi/sdk');

const app = express();
const port = process.env.PORT || 3000;

const sdk = new Defined(MY_API_KEY);

// Define a route to fetch a token
app.get('/fetch-token', async (req, res) => {
  try {
    const tokenInfo = await sdk.queries.token({
      input: {
        address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        networkId: 56,
      },
    });
    res.json({ tokenInfo });
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route to get information about networks
app.get('/get-networks', async (req, res) => {
  try {
    const result = await sdk.send(`
      query GetNetworks {
        getNetworks {
          id
          name
        }
      }
    `, {});
    res.json({ networks: result.getNetworks });
  } catch (error) {
    console.error('Error fetching networks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
