# RAW-TX-Listener
This server is intended to send raw transaction into Blockchain by turns.

## Case
▶️You want to send two or more transactions to different addresses

▶️Every transaction should consists of two outputs (receiver address and change to you)

## Problem
❓ How you can sign new transaction without confirming the last?

🤔 So, new output of your address haven't confirmed yet. What you can do?

## Solution
✅ Generate first signed transaction

✅ Artificially generate outputs of second transaction

1. Get used output amount from first transaction
2. This amount minus send sum minus miner fee will be you new output amount
3. Generate tx id of first signed transaction  
  3.1.Let's say that signed data of this tx is *S*  
  3.2.Future tx id of this transaction will *sha256(sha256(S)).reverse()*  
4. Get another meta information and push it into second tx output  
5. Sign second transaction  

✅ Wait while first transaction will be confirmed

✅ Send second signed transaction into Blockchain

## Start it!
```

npm i

node server.js

```

or

```

sudo docker build -t listener .

sudo docker run -p 3002:3002 listener

```

## How works this server?
* **URL**
```/utxo_tx```
* **Method**
  `POST`
*  **Body Params**
```
type: Object

{
    currency: {String} "BTC" or "BCH" or "LTC"
    network: {String} - "testnet" or "livenet"
    senderAddress: {String} - Sender address
    signedTransactions: {Array} - Array of signed transactions
}
```
*  **Response**
```
{error: null|Error, result: 'success'|null}
```

##  **What library can help you to sign transactions like this?**
Using [lighty-sig](https://github.com/button-tech/lighty-sig) library you can easy sign several transactions and push it into blockchain using this server.

Look at `signTransaction` method into lighty-sig library. (the last argument should be "1")
