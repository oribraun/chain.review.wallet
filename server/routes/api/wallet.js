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
        // data = 'status protocol pubkey vin lastseen activeseconds'
        // row = {
        //     "eec430188c75677b5e32f847946bbc921227ee66f360a00282b173978ac1b11f-0" : "   ENABLED 60022 PAhQnGzCNkDSmZ3QomtoAcKQeD817xPTCn a2dql2c35sa4h6hx.onion:18888 1618389137   738290 1618371111",
        //     "59d8b135f735c1474d7623fb432260495953692d4fb2d1f0da89a4adbf7af295-0" : "   ENABLED 60022 PTFHZndtE7J4bTZ6whtqcJ6hahNEP44wzW 192.93.173.212:18893 1618387905    43305 1618344600"
        // }
        results = JSON.parse(results);
        const final_results = [];
        for (var i in results) {
            const arr = results[i].replace(/\s+/g, ' ').trim().split(" ")
            const status = arr[0];
            const protocol = arr[1];
            const pubkey = arr[2]; // address
            const vin = arr[3]; // ip
            const lastseen = parseInt(arr[4]);
            const activeseconds = parseInt(arr[5]);
            // console.log('status', status)
            // console.log('protocol', protocol)
            // console.log('pubkey', pubkey)
            // console.log('vin', vin)
            // console.log('lastseen', lastseen)
            // console.log('activeseconds', activeseconds)
            final_results.push({
                    "rank": 0,
                    "network": "ipv6",
                    "txhash": "527b666bdccc5295d06fa88aef7cbf09254b4aff8d8cbc85e04e93e5dc0a1c59",
                    "outidx": 0,
                    "pubkey": "047eecc192f44fa813066795d9fb04ff2b57f074f9aac6e5f96deea2ef8a9a5dbdb90912583fd685076c331ae553f291b798b7c75775579b707aa850cbd5eb0a51",
                    "collateral": 10000,
                    "status": status,
                    "addr": pubkey,
                    "version": protocol,
                    "lastseen": lastseen,
                    "activetime": activeseconds,
                    "lastpaid": 0,
                    "secondsSincePayment": 0
                }
            )
        }
        res.send({err:0, results: JSON.stringify(final_results)});
    }).catch(function(err) {
        res.send({err:1, errMessage: err});
    })
});
router.post('/getMasternodeCount', (req, res) => {
    wallet_commands.getMasternodeCount(res.locals.wallet).then(function(results) {
        results = results.replace(/\s+/g, '').trim().split("/");
        // 'ds', 'enabled', 'all'
        const final_results = {
            "total": results[0],
            "stable": results[0],
            "obfcompat": 0,
            "enabled": results[1],
            "inqueue": 0,
            "ipv4": 0,
            "ipv6": 0,
            "onion": 0
        }
        // console.log('masternodes', masternodes);
        res.send({err:0, results: JSON.stringify(final_results)});
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
    // wallet_commands.getNetworkHashps(res.locals.wallet).then(function(results) {
        // console.log('masternodes', masternodes);
        res.send({err:0, results: 0});
    // }).catch(function(err) {
    //     res.send({err:1, errMessage: err});
    // })
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
