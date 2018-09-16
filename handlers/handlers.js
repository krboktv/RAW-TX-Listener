
const TransactionModule = require('./../transactions/transactions');

async function send(req, res) {
    const body = req.body;
    const currency = body.currency;
    const network = body.network;
    const senderAddress = body.senderAddress;
    const signedTransactions = body.signedTransactions;

    try {
        const result = await TransactionModule.sendTransactions(senderAddress, currency, network, signedTransactions);
        res.send(result != undefined ? result : {error: null, result: 'success'});
        res.end();
    } catch (e) {
        res.send({error: e, result: null})
        res.end();
    }

}

module.exports = {
    send: send
}