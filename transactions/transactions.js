const rp = require('./../requests/requests');

const URL = {
    BTC: {
        getUnconfermedBalance: {
            livenet: 'https://chain.so/api/v2/get_address_spent/BTC/',
            testnet: 'https://chain.so/api/v2/get_address_spent/BTCTEST/',
        },
        get: {
            livenet: 'https://chain.so/api/v2/tx/BTC/',
            testnet: 'https://chain.so/api/v2/tx/BTCTEST/',
        },
        send: {
            livenet: 'https://insight.bitpay.com/api/tx/send/',
            testnet: 'https://test-insight.bitpay.com/api/tx/send/',
        },
        unconfirmedBalancePath: (obj) => obj.data.unconfirmed_sent_value,
        confirmationsPath: (tx) => tx.data.confirmations,
        txidPath: (tx) => tx.data.txid,
        data: (rawtx) => {
            return {"rawtx": rawtx}
        }
    },
    LTC: {
        getUnconfermedBalance: {
            livenet: 'https://chain.so/api/v2/get_address_spent/LTC/',
            testnet: 'https://chain.so/api/v2/get_address_spent/LTCTEST/',
        },
        get: {
            livenet: 'https://chain.so/api/v2/tx/LTC/',
            testnet: 'https://chain.so/api/v2/tx/LTCTEST/',
        },
        send: {
            livenet: 'https://chain.so/api/v2/send_tx/LTC/',
            testnet: 'https://chain.so/api/v2/send_tx/LTCTEST/',
        },
        unconfirmedBalancePath: (obj) => obj.data.unconfirmed_sent_value,
        confirmationsPath: (tx) => tx.data.confirmations,
        txidPath: (tx) => tx.data.txid,
        data: (rawtx) => {
            return {"tx_hex": rawtx}
        }
    },
    BCH: {
        getUnconfermedBalance: {
            livenet: 'https://bch.blockdozer.com/insight-api/addr/',
            testnet: 'https://tbch.blockdozer.com/insight-api/addr/',
        },
        get: {
            livenet: 'https://blockdozer.com/insight-api/tx/send/',
            testnet: 'https://tbch.blockdozer.com/insight-api/tx/',
        },
        send: {
            livenet: 'https://blockdozer.com/insight-api/tx/send/',
            testnet: 'https://tbch.blockdozer.com/insight-api/tx/send/',
        },
        unconfirmedBalancePath: (obj) => obj.unconfirmedBalance,
        confirmationsPath: (tx) => tx.confirmations,
        txidPath: (tx) => tx.txid,
        data: (rawtx) => {
            return {"rawtx": rawtx}
        }
    }
};

async function sendTransactions(senderAddress, currency, network, signedTransactions, callback) {
    const tx_hash = [];
    let counter = 0;

    const response = await rp.getUnconfirmedBalance(URL[currency].getUnconfermedBalance[network] + senderAddress);
    console.log(response)
    const unconfirmedBalance = URL[currency].unconfirmedBalancePath(response);

    if (unconfirmedBalance != 0) {
        callback('Please wait while last transaction will be confirm', null);
        return;
    } else {
        console.log(URL[currency].data(signedTransactions[counter]))
        tx_hash[tx_hash.length] = URL[currency].txidPath(await transactionWaiting(URL[currency].send[network], URL[currency].data(signedTransactions[counter])));
        console.log("Trnsaction hash: " + tx_hash[tx_hash.length - 1]);
        counter++;
    }


    let listener = setTimeout(async function recursion() {
        try {
            const checker = await checkTransaction(currency, network, tx_hash[tx_hash.length - 1]);
            console.log(checker === true ? 'Transaction was confirmed' : 'Wait for ' + tx_hash[tx_hash.length - 1]);

            if (checker === true) {
                console.log(URL[currency].data(signedTransactions[counter]))
                tx_hash[tx_hash.length] = URL[currency].txidPath(await transactionWaiting(URL[currency].send[network], URL[currency].data(signedTransactions[counter])));
                console.log("Trnsaction hash: " + tx_hash[tx_hash.length - 1]);
                counter++;
            }

            if (tx_hash.length === signedTransactions.length) {
                callback(null, tx_hash);
                clearTimeout(listener);
                return;
            }

            setTimeout(() => recursion(), 30000);
        } catch (e) {
            console.log(e)
            // TODO: Добавить проверку последней транзакции по этому адресу. Если она подтверждена, а тут лажа - то отдавать на клиент ошибку
        }
    }, 5000);
    // TODO: Оптимизировать время под каждый блокчейн. Брать среднее время и потом делить время таймера на 2 минимумс
}

async function recursion(counter, tx_hash, listener, network) {

}

const checkTransaction = async (currency, network, transactionHash) => {
    const tx = await rp.getTransaction(URL[currency].get[network] + transactionHash);
    try {
        return URL[currency].confirmationsPath(tx) > 0 ? true : false;
    } catch (e) {
        return false;
    }
}

const transactionWaiting = async (url, rawtx) => await rp.sendTransaction(url, rawtx);

module.exports = {
    sendTransactions: sendTransactions
}
