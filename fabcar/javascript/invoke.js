/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
// import express from "express";
const express = require('express');
const bodyParser =  require('body-parser');
const cors = require('cors');



const app = express();
app.use(bodyParser.json());
app.use(cors());

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

// const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
const ccpPath = path.resolve(__dirname, 'poc-network.json');



let gettxid = (asset) => {
    return new Promise((resolve, reject) => {
        async function getid(asset) {
            try {

                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const userExists = await wallet.exists('user1');
                if (!userExists) {
                    console.log('An identity for the user "user1" does not exist in the wallet');
                    console.log('Run the registerUser.js application before retrying');
                    return;
                }

                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: false, asLocalhost: false }} );

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');

                const myTx = contract.createTransaction('createContract');
                if(!asset.someUniqueID){
                    throw error;
                }
                if(!asset.encryptionKey){
                    throw error;
                }
                if(!asset.hash){
                    throw error;
                }
                if(!asset.name){
                    asset.name = 'NA';
                }
                if(!asset.note){
                    asset.note = 'NA';
                }
                if(!asset.fileType){
                    throw error;
                }
                await myTx.submit(asset.someUniqueID, JSON.stringify(asset.encryptionKey), JSON.stringify(asset.hash), JSON.stringify(asset.name), JSON.stringify(asset.note),JSON.stringify(asset.fileType));
                const txId = myTx.getTransactionID();
                console.log('Transaction has been submitted');
                // console.log(txId);

                // Disconnect from the gateway.
                await gateway.disconnect();
                console.log('executed');
                resolve(txId);
            } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                reject(error);
                process.exit(1);
            }
        }
        getid(asset);
    });

};



let getdetails = (txid) => {
    return new Promise((resolve, reject) => {
        async function tmp (txid) {
            try{
                if(!txid)
                {
                    throw error;
                }
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const userExists = await wallet.exists('user1');
                if (!userExists) {
                    console.log('An identity for the user "user1" does not exist in the wallet');
                    console.log('Run the registerUser.js application before retrying');
                    return;
                }

                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: false, asLocalhost: false }} );

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');
                const channel = network.getChannel();
                // Get the contract from the network.

                let response_payload = await channel.queryTransaction(txid);
                resolve (response_payload);
            }catch(err){
                console.log(err);
                reject(err);
            }
        }
        tmp(txid);
    });
};


app.post('/add-transaction',(req, response) => {
    console.log(req.body);
    req.body.someUniqueID = req.body.edexaContractNo;
    delete req.body.edexaContractNo;
    gettxid(req.body).then(res => {
        delete res._nonce;
        delete res._admin;
        res.transactionId = res._transaction_id;
        delete res._transaction_id;
        response.send(res);
    }).catch (err => {
        response.sendStatus(500);
        console.log(err);
    });
    // response.send(txid);
    // test(req.body);
    // response.sendStatus(200);
});

app.post('/transaction',(req, response) => {
    console.log(req.body);
    try{
        // let details = getDetaills(req.body.txid);
        getdetails(req.body.id).then(res => {
            let output = res.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[0].rwset.writes;
            delete output.is_delete;
            let withoutSlashes = output[0].value.replace(/\\/g, "");
            let withoutQuotes = withoutSlashes.replace(/""/g, '"');
            let final = JSON.parse(withoutQuotes);
            final.transactionId = req.body.id;
            let d = new Date();
            let n = d.toISOString();
            final.timestamp = n;
            // console.log({final});
            response.send(final);
        });
    }catch (err){
        response.sendStatus(500);
        console.log('err');
    }
});

//transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes


app.listen(4000, () => {
    console.log('Started on port 4000');
});
