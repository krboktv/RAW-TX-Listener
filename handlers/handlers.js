
const TransactionModule = require('./../transactions/transactions');

async function sendTransaction(req, res) {
    const body = req.body;
    const currency = body.currency;
    const network = body.network;
    const senderAddress = body.senderAddress;
    const signedTransactions = body.signedTransactions;

    try {
        console.log('ffff')
        TransactionModule.sendTransactions(senderAddress, currency, network, signedTransactions, (err, result) => {
            res.send({error: err, result: result});
        });
    } catch (e) {
        res.send({error: e, result: null});
    }
}

module.exports = {
    sendTransaction: sendTransaction
}