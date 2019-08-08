/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const edexaContract = [
            {
                encryptionKey: 'kxYye694ugubYc7J7P3hu184',
                hash: '2cd4e52fc1a345da8ad7d6edea15764f9495eed0821e78595d64c9f35a0663d9c863c751794cada6f8e5dfb71c2c1be694f3803c5caa4553efd356de6045fc20',
                name: '111',
                note: '111',
                fileType: 'png'
            },
            {
                encryptionKey: '5OIR4bkyLjmA2baU001maymk',
                hash: '222959016d0c499e63e95b031042c3cde59d4823737fd6c98adf4ca71b10c09733d0308f62f903bc0cdb5331247f78fa6a17bf315a96baafd8fa92e7c8da99e1022',
                name: '222',
                note: '222',
                fileType: 'png'
            },
            {
                encryptionKey: 'fw5tmqhYl08acUBgCxOdo23i',
                hash: '3d80e377dcf4d1a4dea01ba1a6d32efc952d1449c0a02f7bb079c4a2f2b26f93fcd33b13d71f55992e4a93e50d8ffeafe235482e0afc87a2064b52e32ccd4e05',
                name: '333',
                note: '333',
                fileType: 'png'
            },
            {
                encryptionKey: '1r75S0dksqDcfhyVw9Ak4Mv4',
                hash: '9cc096a5258ebc51b3795714b2661cdd90b183d728b46fe6e97e461f63bbe299edaaab150a5591bf0571f660cd123aebc77c7985cc0090fd853b8f92f5a300e1',
                name: '444',
                note: '444',
                fileType: 'png'
            },
            {
                encryptionKey: '2V7u4oblG4Khx78ez6r68TeP',
                hash: '7d3f2e8cf925a02bb4be798dffa5f729a213588bd704418847e5ddde13cc8215cc245321477e1ba1018b1bf701cf8ebd75575df344f8e40fc8b30ba5d3b5943a',
                name: '555',
                note: '555',
                fileType: 'png'
            },
        ];

        for (let i = 0; i < edexaContract.length; i++) {
            edexaContract[i].docType = 'EdexaContract';
            await ctx.stub.putState('EdexaContract' + i, Buffer.from(JSON.stringify(edexaContract[i])));
            console.info('Added <--> ', edexaContract[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async createContract(ctx, uniqueId, encryptionKey, hash, name, note, fileType) {
        console.info('============= START : Create Contract ===========');
        console.log(ctx);

        const Transaction = {
            encryptionKey,
            docType: 'EdexaContract',
            hash,
            name,
            note,
            fileType
        };

        await ctx.stub.putState(uniqueId, Buffer.from(JSON.stringify(Transaction)));
        console.info('============= END : Create Contract ===========');
    }
}

module.exports = FabCar;
