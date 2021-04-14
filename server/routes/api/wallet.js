const express = require('express');
var router = express.Router();
const wallet_commands = require('../../wallet_commands');

// router.post('/', (req, res) => {
//     res.locals.wallet
//     res.json({item: 'wallet api'});
// });
router.post('/startWallet', (req, res) => {
    wallet_commands.startWallet(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/stopWallet', (req, res) => {
    wallet_commands.stopWallet(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/reindexWallet', (req, res) => {
    wallet_commands.reindexWallet(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/rescanWallet', (req, res) => {
    wallet_commands.rescanWallet(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getBlock/:hash', (req, res) => {
    wallet_commands.getBlock(res.locals.wallet, req.params['hash']).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getBlockhash/:number', (req, res) => {
    wallet_commands.getBlockHash(res.locals.wallet, req.params['number']).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getBlockcount', (req, res) => {
    wallet_commands.getBlockCount(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/listMasternodes', (req, res) => {
    wallet_commands.getAllMasternodes(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getMasternodeCount', (req, res) => {
    wallet_commands.getMasternodeCount(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getRawTransaction/:txid/:verbose', (req, res) => {
    wallet_commands.getRawTransaction(res.locals.wallet, req.params['txid'], req.params['verbose']).then(function(results) {
        // console.log('masternodes', masternodes);
        // res.send({err:0, results: results});
        res.send({err:0, results: results});
        // res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getConnectionCount', (req, res) => {
    wallet_commands.getConnectionCount(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getPeerInfo', (req, res) => {
    wallet_commands.getPeerInfo(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getDifficulty', (req, res) => {
    wallet_commands.getDifficulty(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getNetworkHashps', (req, res) => {
    wallet_commands.getNetworkHashps(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getMiningInfo', (req, res) => {
    wallet_commands.getMiningInfo(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getTxoutsetInfo', (req, res) => {
    wallet_commands.getTxoutsetInfo(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getInfo2', (req, res) => {
    wallet_commands.getInfo(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        results = JSON.parse(results);
        if(!results.difficulty) {
            results.difficulty = 0;
        }
        if(!results.moneysupply) {
            results.moneysupply = 0;
        }
        results = JSON.stringify(results);
        res.send({err:0, results: results});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});

router.post('/getInfo', (req, res) => {
    var data = {};
    var promises = [];

    promises.push(new Promise((resolve, reject) => {
        wallet_commands.getInfo(res.locals.wallet).then(function (results) {
            // console.log('masternodes', masternodes);
            results = JSON.parse(results);
            results.version = results.version.replace(/\./g, "").replace(/-.*/g, "").replace(/v/g, "")
            results.version = parseInt(results.version.split("").join("0"))
            data.info = results;
            resolve();
        }).catch(function (err) {
            reject(err);
        })
    }))
    promises.push(new Promise((resolve, reject) => {
        wallet_commands.getDifficulty(res.locals.wallet).then(function (results) {
            // console.log('masternodes', masternodes);
            data.difficulty = parseFloat(results);
            resolve();
        }).catch(function (err) {
            reject(err);
        })
    }));
    Promise.all(promises).then((response) => {
        if (!data.info.difficulty) {
            data.info.difficulty = data.difficulty;
        }
        if (!data.info.moneysupply) {
            data.info.moneysupply = data.txoutsetInfo.total_amount;
        }
        res.send({err:0, results: JSON.stringify(data.info)});
    }).catch((error) => {
        res.send({err:1, errMessage: error});
    })
});

module.exports = router;
