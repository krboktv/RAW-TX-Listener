
const TransactionModule = require('./../transactions/transactions');

async function send(req, res) {
    const body = req.body;
    const currency = body.currency;
    const network = body.network;
    const senderAddress = body.senderAddress;
    const signedTransactions = body.signedTransactions;

    const result = await TransactionModule.sendTransactions(senderAddress, currency, network, signedTransactions);
    res.send(result != undefined ? result : {error: null, result: 'success'});
}

module.exports = {
    send: send
}