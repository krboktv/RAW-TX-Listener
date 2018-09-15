const rp = require('request-promise');

const sendTransaction = async (url, data) =>  await query('POST', url, data);

const getTransaction = async (url) => await query('GET', url);

const getUnconfirmedBalance = async (url) => await query('GET', url);

async function query(method, url, data) {
    const options = {
        method: method,
        uri: url,
        body: data,
        json: true
    };

    return await rp(options);
}

module.exports = {
    sendTransaction: sendTransaction,
    getTransaction: getTransaction,
    getUnconfirmedBalance: getUnconfirmedBalance
}