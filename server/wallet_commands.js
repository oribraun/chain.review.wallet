const spawn = require('child_process').spawn;
const request = require('request');
const helpers = require('./helpers');
const settings = require('./wallets/all_settings');

const TEN_MEGABYTES = 1000 * 1000 * 10;
const options = {};
const execFileOpts = { encoding: 'utf8' ,maxBuffer: TEN_MEGABYTES };

var startWallet = function(wallet) {
    var results = "";
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }

        // -txindex
        var wallet_daemon = settings[wallet]['daemon'];
        var start_wallet_command = settings[wallet]['commands']['startwallet'];
        var proc = spawn(wallet_daemon, [start_wallet_command], { execFileOpts, options }, function done(err, stdout, stderr) {
            if (err) {
                // console.error('Error:', err.stack);
                reject(err.stack);
                try {
                    proc.kill('SIGINT');
                    // fs.removeSync(__dirname + sess.dir);
                    // delete sess.proc;
                    // delete sess.dir;
                } catch(e) {
                    // console.log('e', e);
                }
                // throw err;
            }
            console.log('Success', stdout);
            // console.log('Err', stderr);
        });
        proc.stdout.setEncoding('utf8');
        // sess.proc = proc;
        // sess.dir = dir;
        // console.log("sess.proc.pid before", sess.proc.pid)

        proc.stderr.on('data', function(data) {
            // console.log('err', data.toString('utf8'));
            reject(data.toString('utf8'));
            // process.stderr.write(data);
        });
        proc.stdout.on('data', function(data) {
            // var data = JSON.parse(data);
            // console.log('data', data);
            results += data;
            resolve(results);
            // process.stdout.write(data);
        });
        proc.on('close', function(code, signal) {
            // console.log('code', code);
            // console.log('signal', signal);
            // console.log('spawn closed');
            if(!code) {
                if(!results) {
                    results = settings[wallet]['coin'] + ' Core starting'
                }
                resolve(results);
            } else {
                reject('empty results');
            }
        });
        proc.on('error', function(code, signal) {
            reject(code);
        });
        proc.on('exit', function (code) {
            // console.log('spawn exited with code ' + code);
            proc.stdin.end();
            proc.stdout.destroy();
            proc.stderr.destroy();
        });
    });
    return promise;
}

var reindexWallet = function(wallet) {
    var results = "";
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }

        // -txindex
        var wallet_daemon = settings[wallet]['daemon'];
        var start_wallet_command = settings[wallet]['commands']['reindexWallet'];
        var proc = spawn(wallet_daemon, start_wallet_command.split(' '), { execFileOpts, options }, function done(err, stdout, stderr) {
            if (err) {
                // console.error('Error:', err.stack);
                reject(err.stack);
                try {
                    proc.kill('SIGINT');
                    // fs.removeSync(__dirname + sess.dir);
                    // delete sess.proc;
                    // delete sess.dir;
                } catch(e) {
                    // console.log('e', e);
                }
                // throw err;
            }
            // console.log('Success', stdout);
            // console.log('Err', stderr);
        });
        proc.stdout.setEncoding('utf8');
        // sess.proc = proc;
        // sess.dir = dir;
        // console.log("sess.proc.pid before", sess.proc.pid)

        proc.stderr.on('data', function(data) {
            // console.log('err', data.toString('utf8'));
            reject(data.toString('utf8'));
            // process.stderr.write(data);
        });
        proc.stdout.on('data', function(data) {
            // var data = JSON.parse(data);
            // console.log('data', data);
            results += data;
            resolve(results);
            // process.stdout.write(data);
        });
        proc.on('close', function(code, signal) {
            // console.log('code', code);
            // console.log('signal', signal);
            // console.log('spawn closed');

        });
        proc.on('error', function(code, signal) {
            reject(code);
        });
        proc.on('exit', function (code) {
            // console.log('spawn exited with code ' + code);
            proc.stdin.end();
            proc.stdout.destroy();
            proc.stderr.destroy();
        });
    });
    return promise;
}

var rescanWallet = function(wallet) {
    var results = "";
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }

        // -txindex
        var wallet_daemon = settings[wallet]['daemon'];
        var start_wallet_command = settings[wallet]['commands']['rescanWallet'];
        var proc = spawn(wallet_daemon, start_wallet_command.split(' '), { execFileOpts, options }, function done(err, stdout, stderr) {
            if (err) {
                // console.error('Error:', err.stack);
                reject(err.stack);
                try {
                    proc.kill('SIGINT');
                    // fs.removeSync(__dirname + sess.dir);
                    // delete sess.proc;
                    // delete sess.dir;
                } catch(e) {
                    // console.log('e', e);
                }
                // throw err;
            }
            // console.log('Success', stdout);
            // console.log('Err', stderr);
        });
        proc.stdout.setEncoding('utf8');
        // sess.proc = proc;
        // sess.dir = dir;
        // console.log("sess.proc.pid before", sess.proc.pid)

        proc.stderr.on('data', function(data) {
            // console.log('err', data.toString('utf8'));
            reject(data.toString('utf8'));
            // process.stderr.write(data);
        });
        proc.stdout.on('data', function(data) {
            // var data = JSON.parse(data);
            // console.log('data', data);
            results += data;
            resolve(results);
            // process.stdout.write(data);
        });
        proc.on('close', function(code, signal) {
            // console.log('code', code);
            // console.log('signal', signal);
            // console.log('spawn closed');
        });
        proc.on('error', function(code, signal) {
            reject(code);
        });
        proc.on('exit', function (code) {
            // console.log('spawn exited with code ' + code);
            proc.stdin.end();
            proc.stdout.destroy();
            proc.stderr.destroy();
        });
    });
    return promise;
}

var stopWallet = function(wallet) {
    var wallet_cli = settings[wallet]['cli'];
    var stop_wallet_command = settings[wallet]['commands']['stopwallet'];
    var commands = [];
    commands.push(stop_wallet_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type int
                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}

var getBlockCount = function(wallet) {
    var wallet_cli = settings[wallet]['cli'];
    var get_block_count_command = settings[wallet]['commands']['getblockcount'];
    var commands = [];
    commands.push(get_block_count_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type int
                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}

var getBlock = function(wallet, hash) {
    var wallet_cli = settings[wallet]['cli'];
    var get_block_command = settings[wallet]['commands']['getblock'];
    var commands = [];
    commands.push(get_block_command);
    commands.push(hash.toString());
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type block
                // {
                //     hash: '000000428366d3a156c38c5061d74317d201781f539460aeeeaae1091de6e4cc',
                //         confirmations: 215348,
                //     size: 298,
                //     height: 0,
                //     version: 1,
                //     merkleroot: '17d377a8a6d988698164f5fc9ffa8d5d03d0d1187e3a0ed886c239b3eae4be2f',
                //     acc_checkpoint: '0000000000000000000000000000000000000000000000000000000000000000',
                //     tx: [
                //     '17d377a8a6d988698164f5fc9ffa8d5d03d0d1187e3a0ed886c239b3eae4be2f'
                // ],
                //     time: 1559224740,
                //     mediantime: 1559224740,
                //     nonce: 3617423,
                //     bits: '1e0ffff0',
                //     difficulty: 0.000244140625,
                //     chainwork: '0000000000000000000000000000000000000000000000000000000000100010',
                //     nextblockhash: '00000cc8e391a6cbd8212446e1f730ebda98e1d2cdc5ef5efa86d0b385c6228e',
                //     moneysupply: 0,
                //     zFIXsupply: {
                //     '1': 0,
                //         '5': 0,
                //         '10': 0,
                //         '50': 0,
                //         '100': 0,
                //         '500': 0,
                //         '1000': 0,
                //         '5000': 0,
                //         total: 0
                //     }
                // }

                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}

var getBlockHash = function(wallet, index) {
    var wallet_cli = settings[wallet]['cli'];
    var get_block_hash_command = settings[wallet]['commands']['getblockhash'];
    var commands = [];
    commands.push(get_block_hash_command);
    commands.push(index.toString());
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        if(wallet_cli.indexOf('http') > -1) {
            getFromUrl(wallet_cli, commands).then(
                (results) => {
                    //TODO make sure return type hash
                    resolve(results);
                },
                (error) => {
                    reject(error);
                }
            )
        } else {
            getFromWallet(wallet_cli, commands).then(
                (results) => {
                    //TODO make sure return type hash
                    resolve(results);
                },
                (error) => {
                    reject(error);
                }
            )
        }
    });
    return promise;
}

var getAllBlocks = function(wallet, callback) {
    var results = "";
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getBlockCount(wallet).then(function (blockCount) {
            var split_proccess = 4;
            var blockCount = blockCount;
            // console.log('getBlockCount', blockCount);
            var startTime = new Date();
            var endTime = 0;
            var i = 0;
            function getBlocksHash(index) {
                getBlockHash(wallet, index).then(function (hash) {
                    callback(index, hash);
                    if (index >= blockCount) {
                        endTime = new Date();
                        // console.log('startTime', startTime)
                        // console.log('endTime', endTime)
                        var diff = endTime - startTime;
                        var msec = diff;
                        var hh = Math.floor(msec / 1000 / 60 / 60);
                        msec -= hh * 1000 * 60 * 60;
                        var mm = Math.floor(msec / 1000 / 60);
                        msec -= mm * 1000 * 60;
                        var ss = Math.floor(msec / 1000);
                        msec -= ss * 1000;
                        // console.log('endTime - startTime', hh + ":" + mm + ":" + ss + "." + msec);
                        // console.log('blocks.length', blocks.length);
                        resolve(hh + ":" + mm + ":" + ss + "." + msec);
                    } else {
                        // console.log('getBlockHash - ' + index, hash);
                        // blocks.push(hash);
                        index += split_proccess;
                        if(index <= blockCount) {
                            getBlocksHash(index)
                        }
                    }
                }).catch(function (err) {
                    // console.log('getBlockHash err', err)
                    reject(err);
                })
            }
            for(var j = 0; j < split_proccess; j++) {
                getBlocksHash(j);
            }
        }).catch(function (err) {
            // console.log('getBlockCount err', err)
            reject(err);
        });
    });
    return promise;
}

var reindex = function(wallet, callback) {
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getBlockCount(wallet).then(function (blockCount) {
            var blockCount = blockCount;
            // console.log('getBlockCount', blockCount);
            var startTime = new Date();
            var endTime = 0;
            var i = 0;
            // TODO remove db blocks
            function getBlocksHash(index) {
                getBlockHash(wallet, index).then(function (hash) {
                    callback(index, hash);
                    if (index >= blockCount) {
                        endTime = new Date();
                        // console.log('startTime', startTime)
                        // console.log('endTime', endTime)
                        var diff = endTime - startTime;
                        var msec = diff;
                        var hh = Math.floor(msec / 1000 / 60 / 60);
                        msec -= hh * 1000 * 60 * 60;
                        var mm = Math.floor(msec / 1000 / 60);
                        msec -= mm * 1000 * 60;
                        var ss = Math.floor(msec / 1000);
                        msec -= ss * 1000;
                        // console.log('endTime - startTime', hh + ":" + mm + ":" + ss + "." + msec);
                        // console.log('blocks.length', blocks.length);
                        resolve(hh + ":" + mm + ":" + ss + "." + msec);
                    } else {
                        // console.log('getBlockHash - ' + index, hash);
                        // blocks.push(hash);
                        getBlocksHash(++index)
                    }
                }).catch(function (err) {
                    // console.log('getBlockHash err', err)
                    reject(err);
                })
            }
            getBlocksHash(i);
        }).catch(function (err) {
            // console.log('getBlockCount err', err)
            reject(err);
        });
    });
    return promise;
}

var getNewBlocks = function(wallet, callback) {
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getBlockCount(wallet).then(function (blockCount) {
            var blockCount = blockCount;
            // console.log('getBlockCount', blockCount);
            var startTime = new Date();
            var endTime = 0;
            var i = 0;
            // TODO get db latest blocks
            function getBlocksHash(index) {
                getBlockHash(wallet, index).then(function (hash) {
                    callback(index, hash);
                    if (index >= blockCount) {
                        endTime = new Date();
                        // console.log('startTime', startTime)
                        // console.log('endTime', endTime)
                        var diff = endTime - startTime;
                        var msec = diff;
                        var hh = Math.floor(msec / 1000 / 60 / 60);
                        msec -= hh * 1000 * 60 * 60;
                        var mm = Math.floor(msec / 1000 / 60);
                        msec -= mm * 1000 * 60;
                        var ss = Math.floor(msec / 1000);
                        msec -= ss * 1000;
                        // console.log('endTime - startTime', hh + ":" + mm + ":" + ss + "." + msec);
                        // console.log('blocks.length', blocks.length);
                        resolve(hh + ":" + mm + ":" + ss + "." + msec);
                    } else {
                        // console.log('getBlockHash - ' + index, hash);
                        // blocks.push(hash);
                        getBlocksHash(++index)
                    }
                }).catch(function (err) {
                    // console.log('getBlockHash err', err)
                    reject(err);
                })
            }
            getBlocksHash(i);
        }).catch(function (err) {
            // console.log('getBlockCount err', err)
            reject(err);
        });
    });
    return promise;
}

var getAllMasternodes = function(wallet) {
    var wallet_cli = settings[wallet]['cli'];
    var get_allmasternodes_command = settings[wallet]['commands']['getallmasternodes'].split(" ");
    var commands = [];
    commands = commands.concat(get_allmasternodes_command)
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type masternodes array of object
                // {
                //     rank: 100,
                //         network: 'ipv4',
                //     txhash: 'd56e0b445a1d916b525d3764b90871aae01e2a7296ddc251e4dfe9d113322c81',
                //     outidx: 1,
                //     pubkey: '0456186cd375d3851f5ed6716f8c243f4652b520fb2cf6803190e2f664c86190c51b184fe28d5719f78c8592909d7a910182960c36488be68bc756d192a460f00b',
                //     collateral: 1000000,
                //     status: 'ENABLED',
                //     addr: 'FHwVLJcPQHjaKz84tC5gkH8mmmS9CjmsGT',
                //     version: 70921,
                //     lastseen: 1586013641,
                //     activetime: 10645328,
                //     lastpaid: 1585469212
                // }
                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}

var getMasternodeCount = function(wallet) {
    var wallet_cli = settings[wallet]['cli'];
    var get_allmasternodes_command = settings[wallet]['commands']['getmasternodecount'].split(" ");
    var commands = [];
    commands = commands.concat(get_allmasternodes_command)
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type object
                // {
                //     total: 1324,
                //     stable: 1315,
                //     obfcompat: 1315,
                //     enabled: 1315,
                //     inqueue: 1233,
                //     ipv4: 843,
                //     ipv6: 471,
                //     onion: 0
                // }
                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}

var getRawTransaction = function(wallet, txid, verbose) {
    var wallet_cli = settings[wallet]['cli'];
    var get_rawtransaction_command = settings[wallet]['commands']['getrawtransaction'];
    var commands = [];
    commands.push(get_rawtransaction_command);
    commands.push(txid.toString());
    commands.push(verbose.toString());
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type object
                // {
                //     hex: '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0451021404ffffffff010000c52ebca2b1002321020a306f5db7863475d3c11bee89e29f579ffbbe3117cf6cc6b18e5aae0eb7b6bdac00000000',
                //     txid: '30d701a30486a3e1791f1a29a7ac452a7adf72e7a3bef98235f9bf935fb34827',
                //     version: 1,
                //     locktime: 0,
                //     vin: [ { coinbase: '51021404', sequence: 4294967295 } ],
                //     vout: [ { value: 500000000, n: 0, scriptPubKey: [Object] } ],
                //     blockhash: '00000cc8e391a6cbd8212446e1f730ebda98e1d2cdc5ef5efa86d0b385c6228e',
                //     confirmations: 215349,
                //     time: 1559228652,
                //     blocktime: 1559228652
                // }

                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}

var getConnectionCount = function(wallet){
    var wallet_cli = settings[wallet]['cli'];
    var get_connection_count_command = settings[wallet]['commands']['getconnectioncount'];
    var commands = [];
    commands.push(get_connection_count_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type int
                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}
var getInfo = function(wallet){
    var wallet_cli = settings[wallet]['cli'];
    var get_info_command = settings[wallet]['commands']['getinfo'];
    var commands = [];
    commands.push(get_info_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type object
                // {
                //     "version": 3030400,
                //     "protocolversion": 70921,
                //     "walletversion": 61000,
                //     "balance": 0.00000000,
                //     "blocks": 215366,
                //     "timeoffset": 0,
                //     "connections": 110,
                //     "proxy": "",
                //     "difficulty": 6555342.677358772,
                //     "testnet": false,
                //     "moneysupply": 3473681471.34521756,
                //     "keypoololdest": 1576493730,
                //     "keypoolsize": 999,
                //     "paytxfee": 0.00000000,
                //     "relayfee": 0.00100000,
                //     "staking status": "Staking Not Active",
                //     "errors": ""
                // }
                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}
var getTxoutsetInfo = function(wallet){
    var wallet_cli = settings[wallet]['cli'];
    var get_txoutset_info_command = settings[wallet]['commands']['gettxoutsetinfo'];
    var commands = [];
    commands.push(get_txoutset_info_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type object
                // {
                //     "height": 215366,
                //     "bestblock": "74033aa064e95344493e5a0affcab2fb2a4f53e217513084e6c702617b594fc4",
                //     "transactions": 435162,
                //     "txouts": 622565,
                //     "bytes_serialized": 22709231,
                //     "hash_serialized": "85c44e98a3c25b334dc8d2110dc4b9d578819ad8f76d8a19a2b092cce73c58b4",
                //     "total_amount": 3473681471.34521756
                // }

                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}
var getPeerInfo = function(wallet){
    var wallet_cli = settings[wallet]['cli'];
    var get_peer_info_command = settings[wallet]['commands']['getpeerinfo'];
    var commands = [];
    commands.push(get_peer_info_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type array of
                // {
                //     "id": 188,
                //     "addr": "149.28.47.182:60368",
                //     "addrlocal": "134.122.85.174:17464",
                //     "services": "0000000000000005",
                //     "lastsend": 1586016299,
                //     "lastrecv": 1586016300,
                //     "bytessent": 15282,
                //     "bytesrecv": 5040,
                //     "conntime": 1586016261,
                //     "timeoffset": 0,
                //     "pingtime": 0.216467,
                //     "version": 70921,
                //     "subver": "/FIX Core:3.3.4/",
                //     "inbound": true,
                //     "startingheight": 215366,
                //     "banscore": 0,
                //     "synced_headers": -1,
                //     "synced_blocks": -1,
                //     "inflight": [
                //     ],
                //     "whitelisted": false
                // }

                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
}
var getDifficulty = function(wallet){
    var wallet_cli = settings[wallet]['cli'];
    var get_difficulty_command = settings[wallet]['commands']['getdifficulty'];
    var commands = [];
    commands.push(get_difficulty_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type number/double
                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
    var results = "";
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        var wallet_cli = settings[wallet]['cli'];
        var get_block_command = settings[wallet]['commands']['getdifficulty'];
        var proc = spawn(wallet_cli, [get_block_command], { execFileOpts, options }, function done(err, stdout, stderr) {
            if (err) {
                // console.error('Error:', err.stack);
                reject(err.stack);
                try {
                    proc.kill('SIGINT');
                    // fs.removeSync(__dirname + sess.dir);
                    // delete sess.proc;
                    // delete sess.dir;
                } catch(e) {
                    // console.log('e', e);
                }
                // throw err;
            }
            // console.log('Success', stdout);
            // console.log('Err', stderr);
        });
        proc.stdout.setEncoding('utf8');
        // sess.proc = proc;
        // sess.dir = dir;
        // console.log("sess.proc.pid before", sess.proc.pid)

        proc.stderr.on('data', function(data) {
            // console.log('err', data.toString('utf8'));
            reject(data.toString('utf8'));
            // process.stderr.write(data);
        });
        proc.stdout.on('data', function(data) {
            // var data = JSON.parse(data);
            // console.log('data', data);
            results += data.replace(/\n|\r/g, "");
            // process.stdout.write(data);
        });
        proc.on('close', function(code, signal) {
            if(results) {
                resolve(results);
            } else {
                reject('empty');
            }
            // console.log('code', code);
            // console.log('signal', signal);
            // console.log('spawn closed');
        });
        proc.on('error', function(code, signal) {
            reject(code);
        });
        proc.on('exit', function (code) {
            // console.log('spawn exited with code ' + code);
            // proc.stdin.end();
            // proc.stdout.destroy();
            // proc.stderr.destroy();
        });
    });
    return promise;
}
var getNetworkHashps = function(wallet){
    var wallet_cli = settings[wallet]['cli'];
    var get_network_hashps_command = settings[wallet]['commands']['getnetworkhashps'];
    var commands = [];
    commands.push(get_network_hashps_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type int
                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
    var results = "";
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        var wallet_cli = settings[wallet]['cli'];
        var get_block_command = settings[wallet]['commands']['getnetworkhashps'];
        var proc = spawn(wallet_cli, [get_block_command], { execFileOpts, options }, function done(err, stdout, stderr) {
            if (err) {
                // console.error('Error:', err.stack);
                reject(err.stack);
                try {
                    proc.kill('SIGINT');
                    // fs.removeSync(__dirname + sess.dir);
                    // delete sess.proc;
                    // delete sess.dir;
                } catch(e) {
                    // console.log('e', e);
                }
                // throw err;
            }
            // console.log('Success', stdout);
            // console.log('Err', stderr);
        });
        proc.stdout.setEncoding('utf8');
        // sess.proc = proc;
        // sess.dir = dir;
        // console.log("sess.proc.pid before", sess.proc.pid)

        proc.stderr.on('data', function(data) {
            // console.log('err', data.toString('utf8'));
            reject(data.toString('utf8'));
            // process.stderr.write(data);
        });
        proc.stdout.on('data', function(data) {
            // var data = JSON.parse(data);
            // console.log('data', data);
            results += data.replace(/\n|\r/g, "");
            // process.stdout.write(data);
        });
        proc.on('close', function(code, signal) {
            if(results) {
                resolve(results);
            } else {
                reject('empty');
            }
            // console.log('code', code);
            // console.log('signal', signal);
            // console.log('spawn closed');
        });
        proc.on('error', function(code, signal) {
            reject(code);
        });
        proc.on('exit', function (code) {
            // console.log('spawn exited with code ' + code);
            // proc.stdin.end();
            // proc.stdout.destroy();
            // proc.stderr.destroy();
        });
    });
    return promise;
}
var getMiningInfo = function(wallet){
    var wallet_cli = settings[wallet]['cli'];
    var get_mining_info_command = settings[wallet]['commands']['getmininginfo'];
    var commands = [];
    commands.push(get_mining_info_command);
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        getFromWallet(wallet_cli, commands).then(
            (results) => {
                //TODO make sure return type object
                // {
                //     "blocks": 215366,
                //     "currentblocksize": 0,
                //     "currentblocktx": 0,
                //     "difficulty": 6555342.677358772,
                //     "errors": "",
                //     "genproclimit": -1,
                //     "networkhashps": 324977233923772,
                //     "pooledtx": 0,
                //     "testnet": false,
                //     "chain": "main",
                //     "generate": false,
                //     "hashespersec": 0
                // }

                resolve(results);
            },
            (error) => {
                reject(error);
            }
        )
    });
    return promise;
    var results = "";
    var promise = new Promise(function(resolve, reject) {
        if(!settings[wallet]) {
            reject('this wallet do not exist in our system');
        }
        var wallet_cli = settings[wallet]['cli'];
        var get_block_command = settings[wallet]['commands']['getmininginfo'];
        var proc = spawn(wallet_cli, [get_block_command], { execFileOpts, options }, function done(err, stdout, stderr) {
            if (err) {
                // console.error('Error:', err.stack);
                reject(err.stack);
                try {
                    proc.kill('SIGINT');
                    // fs.removeSync(__dirname + sess.dir);
                    // delete sess.proc;
                    // delete sess.dir;
                } catch(e) {
                    // console.log('e', e);
                }
                // throw err;
            }
            // console.log('Success', stdout);
            // console.log('Err', stderr);
        });
        proc.stdout.setEncoding('utf8');
        // sess.proc = proc;
        // sess.dir = dir;
        // console.log("sess.proc.pid before", sess.proc.pid)

        proc.stderr.on('data', function(data) {
            // console.log('err', data.toString('utf8'));
            reject(data.toString('utf8'));
            // process.stderr.write(data);
        });
        proc.stdout.on('data', function(data) {
            // var data = JSON.parse(data);
            // console.log('data', data);
            results += data.replace(/\n|\r/g, "");
            // process.stdout.write(data);
        });
        proc.on('close', function(code, signal) {
            if(results) {
                resolve(results);
            } else {
                reject('empty');
            }
            // console.log('code', code);
            // console.log('signal', signal);
            // console.log('spawn closed');
        });
        proc.on('error', function(code, signal) {
            reject(code);
        });
        proc.on('exit', function (code) {
            // console.log('spawn exited with code ' + code);
            // proc.stdin.end();
            // proc.stdout.destroy();
            // proc.stderr.destroy();
        });
    });
    return promise;
}


var getFromWallet = function(wallet_cli, commands) {
    var results = '';
    var promise = new Promise(function(resolve, reject) {
        var proc = spawn(wallet_cli, commands, { execFileOpts, options }, function done(err, stdout, stderr) {
            if (err) {
                // console.error('Error:', err.stack);
                reject(err.stack);
                try {
                    // proc.kill('SIGINT');
                    // fs.removeSync(__dirname + sess.dir);
                    // delete sess.proc;
                    // delete sess.dir;
                } catch(e) {
                    // console.log('e', e);
                }
                // throw err;
            }
            // console.log('Success', stdout);
            // console.log('Err', stderr);
        });
        proc.stdout.setEncoding('utf8');
        // sess.proc = proc;
        // sess.dir = dir;
        // console.log("sess.proc.pid before", sess.proc.pid)

        proc.stderr.on('data', function(data) {
            // console.log('err', data.toString('utf8'));
            reject(data.toString('utf8'));
            // process.stderr.write(data);
        });
        proc.stdout.on('data', function(data) {
            // var data = JSON.parse(data);
            // console.log('data', data);
            results += data.replace(/\n|\r/g, "");
            // process.stdout.write(data);
        });
        proc.on('close', function(code, signal) {
            if(results) {
                resolve(results);
            } else {
                reject('empty results');
            }
            // console.log('code', code);
            // console.log('signal', signal);
            // console.log('spawn closed');
        });
        proc.on('error', function(code, signal) {
            reject(code);
        });
        proc.on('exit', function (code) {
            // console.log('spawn exited with code ' + code);
            // proc.stdin.end();
            // proc.stdout.destroy();
            // proc.stderr.destroy();
        });
    });
    return promise;
}

var getFromUrl = function(wallet_cli, commands) {
    var results = '';
    var promise = new Promise(function(resolve, reject) {
        var url = wallet_cli + '/' + commands.join('/');
        request({uri: url, json: true}, function (error, response, body) {
            if(error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
    return promise;
}


module.exports.startWallet = startWallet; // starting wallet
module.exports.stopWallet = stopWallet; // stopping wallet
module.exports.reindexWallet = reindexWallet; // stopping wallet
module.exports.rescanWallet = rescanWallet; // stopping wallet
module.exports.getBlockCount = getBlockCount; // returning current block count
module.exports.getBlock = getBlock; // returning block details
module.exports.getBlockHash = getBlockHash; // returning specific block hash by index position
module.exports.getAllBlocks = getAllBlocks; // getting all blocks hash
module.exports.reindex = reindex; // TODO
module.exports.getNewBlocks = getNewBlocks;  // TODO
module.exports.getAllMasternodes = getAllMasternodes; // getting all masternodes
module.exports.getMasternodeCount = getMasternodeCount; // getting masternode count
module.exports.getRawTransaction = getRawTransaction; // getting transaction details

module.exports.getConnectionCount = getConnectionCount;
module.exports.getInfo = getInfo;
module.exports.getTxoutsetInfo = getTxoutsetInfo;
module.exports.getPeerInfo = getPeerInfo;
module.exports.getDifficulty = getDifficulty;
module.exports.getNetworkHashps = getNetworkHashps;
module.exports.getMiningInfo = getMiningInfo;

