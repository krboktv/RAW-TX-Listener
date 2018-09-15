const express = require('express');
const bodyParser = require('body-parser');
const handler = require('./handlers/handlers');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/utxo_tx', async (req, res) => handler.sendTransaction(req, res));

app.listen(3000);