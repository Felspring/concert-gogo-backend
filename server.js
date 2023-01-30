'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const users = require('./modules/users');
const events = require('./modules/events');

// *** BRING IN MONGOOSE ***
const mongoose = require('mongoose');

// *** PER MONGOOSE DOCS PLUG AND PLAY CODE ****
mongoose.connect(process.env.DB_URL);

//mongoose status
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

// *******************************

const app = express();

//middleware
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
});


//----- Ticket Master Data Retrievel successful, still working on formatting
app.get('/tickets', async (request, response, next) => {
  try {
    let zipcode = request.query.zipcode;
    let url = `https://app.ticketmaster.com/discovery/v2/events/postalCode=${zipcode}.json?apikey=${API_KEY}`
    let ticketsURL = await axios.get(url);
    console.log(ticketsURL.data);
  } catch (error) {
    console.log(error)
  }
});

app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
});

// ERROR
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));