const wallet_commands = require('./wallet_commands');
var TxController;

var obj = {
    get_input_addresses: function(wallet, vin, vout) {
        var promise = new Promise(function(resolve, reject) {
            var addresses = [];
            if (vin.coinbase) {
                var amount = 0;
                for (var i in vout) {
                    amount = amount + parseFloat(vout[i].value);
                }
                addresses.push({hash: 'coinbase', amount: amount});
                resolve(addresses);
            } else {
                wallet_commands.getRawTransaction(wallet, vin.txid).then(function(tx){
                    if (tx && tx.vout) {
                        console.log('getting vin tx from wallet', vin.txid);
                        var loop = true;
                        // var map = tx.vout.map(function(o) {return o.n});
                        // var index = map.indexOf(vin.vout);
                        // if(index > -1) {
                        //     if (tx.vout[index].scriptPubKey.addresses && tx.vout[index].scriptPubKey.addresses.length) {
                        //         addresses.push({hash: tx.vout[index].scriptPubKey.addresses[0], amount: tx.vout[index].value});
                        //     }
                        //     // console.log('added address to update');
                        // }
                        for(var j = 0; j < tx.vout.length && loop; j++) {
                            if (tx.vout[j].n == vin.vout) {
                                if (tx.vout[j].scriptPubKey.addresses && tx.vout[j].scriptPubKey.addresses.length) {
                                    addresses.push({hash: tx.vout[j].scriptPubKey.addresses[0], amount: tx.vout[j].value});
                                }
                                loop = false;
                            }
                        }
                        resolve(addresses);
                    } else {
                        console.log(' vin tx not found from wallet', vin.txid);
                        resolve();
                    }
                }).catch(function(err) {
                    resolve(addresses);
                })
            }
        })
        return promise;
    },
    get_input_addresses_db: function(wallet, vin, vout) {
        var promise = new Promise(function(resolve, reject) {
            var addresses = [];
            if (vin.coinbase) {
                var amount = 0;
                for (var i in vout) {
                    amount = amount + parseFloat(vout[i].value);
                }
                addresses.push({hash: 'coinbase', amount: amount});
                resolve(addresses);
            } else {
                if(!TxController) {
                    TxController = require('./database/controllers/tx_controller');
                }
                TxController.getTxBlockByTxid(vin.txid, function(tx){
                    if (tx && tx.vout) {
                        // console.log('getting vin tx from wallet ' + tx.blockindex, vin.txid);
                        var loop = true;
                        // var map = tx.vout.map(function(o) {return o.n});
                        // var index = map.indexOf(vin.vout);
                        // if(index > -1) {
                        //     if (tx.vout[index].scriptPubKey.addresses && tx.vout[index].scriptPubKey.addresses.length) {
                        //         addresses.push({hash: tx.vout[index].scriptPubKey.addresses[0], amount: tx.vout[index].value});
                        //     }
                        //     // console.log('added address to update');
                        // }
                        for(var j = 0; j < tx.vout.length && loop; j++) {
                            if (tx.vout[j].n == vin.vout) {
                                if (tx.vout[j].scriptPubKey.addresses && tx.vout[j].scriptPubKey.addresses.length) {
                                    addresses.push({hash: tx.vout[j].scriptPubKey.addresses[0], amount: tx.vout[j].value});
                                }
                                loop = false;
                            }
                        }
                        resolve(addresses);
                    } else {
                        console.log(' vin tx not found from db ', vin.txid);
                        resolve();
                    }
                })
            }
        })
        return promise;
    },
    convert_to_satoshi: function(amount) {
        var promise = new Promise(function(resolve, reject) {
            // fix to 8dp & convert to string
            var fixed = amount.toFixed(8).toString();
            // remove decimal (.) and return integer
            resolve(parseInt(fixed.replace('.', '')));
        });
        return promise;
    },
    is_unique: function(array, object) {
        var promise = new Promise(function(resolve, reject) {
            var unique = true;
            var index = null;
            var loop = true;
            // for(var i = 0; i < array.length && loop; i++) {
            //     if (array[i].addresses == object) {
            //         unique = false;
            //         index = i;
            //         loop = false;
            //     }
            // }
            var map = array.map(function(o) { return o.addresses});
            var i = map.indexOf(object);
            if(i > -1) {
                index = i;
                unique = false;
            }
            resolve({unique: unique, index: index});
        });
        return promise;
    },
    prepare_vin:  function(wallet,tx) {
        var promise = new Promise(function(resolve, reject) {
            var arr_vin = [];

            function prepare(i) {
                obj.get_input_addresses(wallet,tx.vin[i], tx.vout).then(function (addresses) {
                    if (addresses && addresses.length) {
                        obj.is_unique(arr_vin, addresses[0].hash).then(function (obj1) {
                            if (obj1.unique == true) {
                                obj.convert_to_satoshi(parseFloat(addresses[0].amount)).then(function (amount_sat) {
                                    arr_vin.push({addresses: addresses[0].hash, amount: amount_sat});
                                    if (i === tx.vin.length - 1) {
                                        resolve(arr_vin)
                                    } else {
                                        prepare(++i);
                                    }
                                });
                            } else {
                                obj.convert_to_satoshi(parseFloat(addresses[0].amount)).then(function (amount_sat) {
                                    arr_vin[obj1.index].amount = arr_vin[obj1.index].amount + amount_sat;
                                    if (i === tx.vin.length - 1) {
                                        resolve(arr_vin)
                                    } else {
                                        prepare(++i);
                                    }
                                });
                            }
                        }).catch(function (err) {
                            console.log('is_unique', err);
                        })
                    } else {
                        if (i === tx.vin.length - 1) {
                            resolve(arr_vin)
                        } else {
                            prepare(++i);
                        }
                    }
                }).catch(function(err) {
                    console.log('prepare_vin', err);
                })
            }
            if(tx.vin.length) {
                prepare(0);
            } else {
                resolve(arr_vin)
            }
        });
        return promise;
    },
    prepare_vin_db:  function(wallet,tx) {
        var promise = new Promise(function(resolve, reject) {
            var arr_vin = [];

            function prepare(i) {
                obj.get_input_addresses_db(wallet,tx.vin[i], tx.vout).then(function (addresses) {
                    if (addresses && addresses.length) {
                        obj.is_unique(arr_vin, addresses[0].hash).then(function (obj1) {
                            if (obj1.unique == true) {
                                obj.convert_to_satoshi(parseFloat(addresses[0].amount)).then(function (amount_sat) {
                                    arr_vin.push({addresses: addresses[0].hash, amount: amount_sat});
                                    if (i === tx.vin.length - 1) {
                                        resolve(arr_vin)
                                    } else {
                                        prepare(++i);
                                    }
                                });
                            } else {
                                obj.convert_to_satoshi(parseFloat(addresses[0].amount)).then(function (amount_sat) {
                                    arr_vin[obj1.index].amount = arr_vin[obj1.index].amount + amount_sat;
                                    if (i === tx.vin.length - 1) {
                                        resolve(arr_vin)
                                    } else {
                                        prepare(++i);
                                    }
                                });
                            }
                        }).catch(function (err) {
                            console.log('is_unique', err);
                        })
                    } else {
                        if (i === tx.vin.length - 1) {
                            resolve(arr_vin)
                        } else {
                            prepare(++i);
                        }
                    }
                }).catch(function(err) {
                    console.log('prepare_vin', err);
                })
            }
            if(tx.vin.length) {
                prepare(0);
            } else {
                resolve(arr_vin)
            }
        });
        return promise;
    },
    prepare_vout: function(vout, txid, vin) {
        var promise = new Promise(function(resolve, reject) {
            var arr_vout = [];
            var arr_vin = [];
            arr_vin = vin;
            if(!vout.length) {
                resolve({vout: arr_vout, nvin: arr_vin});
            }
            var i = 0;
            function prepare(i) {
                if (vout[i].scriptPubKey.type != 'nonstandard' && vout[i].scriptPubKey.type != 'nulldata' && vout[i].scriptPubKey.addresses && vout[i].scriptPubKey.addresses.length) {
                    obj.is_unique(arr_vout, vout[i].scriptPubKey.addresses[0]).then(function (obj1) {
                        if (obj1.unique == true) {
                            // unique vout
                            obj.convert_to_satoshi(parseFloat(vout[i].value)).then(function (amount_sat) {
                                arr_vout.push({addresses: vout[i].scriptPubKey.addresses[0], amount: amount_sat});
                                if(i === vout.length - 1) {
                                    cont();
                                } else {
                                    prepare(++i)
                                }
                            });
                        } else {
                            // already exists
                            obj.convert_to_satoshi(parseFloat(vout[i].value)).then(function (amount_sat) {
                                arr_vout[obj1.index].amount = arr_vout[obj1.index].amount + amount_sat;
                                if(i === vout.length - 1) {
                                    cont();
                                } else {
                                    prepare(++i)
                                }
                            });
                        }
                    })
                } else {
                    if(i === vout.length - 1) {
                        cont();
                    } else {
                        prepare(++i)
                    }
                }
            }
            prepare(i)
            // for (var i = 0; i < vout.length; i++) {
            //     (function(i) {
            //         if (vout[i].scriptPubKey.type != 'nonstandard' && vout[i].scriptPubKey.type != 'nulldata' && vout[i].scriptPubKey.addresses && vout[i].scriptPubKey.addresses.length) {
            //                 obj.is_unique(arr_vout, vout[i].scriptPubKey.addresses[0]).then(function (obj1) {
            //                     if (obj1.unique == true) {
            //                         // unique vout
            //                         obj.convert_to_satoshi(parseFloat(vout[i].value)).then(function (amount_sat) {
            //                             arr_vout.push({addresses: vout[i].scriptPubKey.addresses[0], amount: amount_sat});
            //                             if(i === vout.length - 1) {
            //                                 cont();
            //                             }
            //                         });
            //                     } else {
            //                         // already exists
            //                         obj.convert_to_satoshi(parseFloat(vout[i].value)).then(function (amount_sat) {
            //                             arr_vout[obj1.index].amount = arr_vout[obj1.index].amount + amount_sat;
            //                             if(i === vout.length - 1) {
            //                                 cont();
            //                             }
            //                         });
            //                     }
            //                 })
            //         } else {
            //             if(i === vout.length - 1) {
            //                 cont();
            //             }
            //         }
            //     })(i)
            // }
            function cont()
            {
                if (vout[0].scriptPubKey.type == 'nonstandard') {
                    if (arr_vin.length > 0 && arr_vout.length > 0) {
                        if (arr_vin[0].addresses == arr_vout[0].addresses) {
                            //PoS
                            arr_vout[0].amount = arr_vout[0].amount - arr_vin[0].amount;
                            arr_vin.shift();
                            resolve({vout: arr_vout, nvin: arr_vin});
                        } else {
                            resolve({vout: arr_vout, nvin: arr_vin});
                        }
                    } else {
                        resolve({vout: arr_vout, nvin: arr_vin});
                    }
                } else {
                    resolve({vout: arr_vout, nvin: arr_vin});
                }
            }
        });
        return promise;
    },
    calculate_total: function(vout) {
        var promise = new Promise(function(resolve, reject) {
            var total = 0;
            for (var i in vout) {
                total = total + vout[i].amount;
            }
            resolve(total);
        });
        return promise;
    },
    getFinishTime: function(startTime) {
        var endTime = new Date();
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
        return (hh + ":" + mm + ":" + ss + "." + msec);
    },
    get_distribution: function(richlist, stats){
        var distribution = {
            supply: stats.supply,
            t_1_25: {percent: 0, total: 0 },
            t_26_50: {percent: 0, total: 0 },
            t_51_75: {percent: 0, total: 0 },
            t_76_100: {percent: 0, total: 0 },
            t_101plus: {percent: 0, total: 0 }
        };
        for(var i = 0; i < richlist.balance.length; i++) {
            var count = i + 1;
            var percentage = ((richlist.balance[i].balance / 100000000) / stats.supply) * 100;
            if (count <= 25) {
                distribution.t_1_25.percent = distribution.t_1_25.percent + percentage;
                distribution.t_1_25.total = distribution.t_1_25.total + (richlist.balance[i].balance / 100000000);
            }
            if (count <= 50 && count > 25) {
                distribution.t_26_50.percent = distribution.t_26_50.percent + percentage;
                distribution.t_26_50.total = distribution.t_26_50.total + (richlist.balance[i].balance / 100000000);
            }
            if (count <= 75 && count > 50) {
                distribution.t_51_75.percent = distribution.t_51_75.percent + percentage;
                distribution.t_51_75.total = distribution.t_51_75.total + (richlist.balance[i].balance / 100000000);
            }
            if (count <= 100 && count > 75) {
                distribution.t_76_100.percent = distribution.t_76_100.percent + percentage;
                distribution.t_76_100.total = distribution.t_76_100.total + (richlist.balance[i].balance / 100000000);
            }
        }
        distribution.t_101plus.percent = parseFloat(100 - distribution.t_76_100.percent - distribution.t_51_75.percent - distribution.t_26_50.percent - distribution.t_1_25.percent).toFixed(2);
        distribution.t_101plus.total = parseFloat(distribution.supply - distribution.t_76_100.total - distribution.t_51_75.total - distribution.t_26_50.total - distribution.t_1_25.total).toFixed(8);
        distribution.t_1_25.percent = parseFloat(distribution.t_1_25.percent).toFixed(2);
        distribution.t_1_25.total = parseFloat(distribution.t_1_25.total).toFixed(8);
        distribution.t_26_50.percent = parseFloat(distribution.t_26_50.percent).toFixed(2);
        distribution.t_26_50.total = parseFloat(distribution.t_26_50.total).toFixed(8);
        distribution.t_51_75.percent = parseFloat(distribution.t_51_75.percent).toFixed(2);
        distribution.t_51_75.total = parseFloat(distribution.t_51_75.total).toFixed(8);
        distribution.t_76_100.percent = parseFloat(distribution.t_76_100.percent).toFixed(2);
        distribution.t_76_100.total = parseFloat(distribution.t_76_100.total).toFixed(8);
        return distribution;
    },
    getGeneralResponse: function() {
        function Respose() {
            return {
                err: 0,
                errMessage: "",
                data: ""
            }
        }
        return Respose();
    },
    ucfirst: function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    ucAllfirstLetters: function(text) {
        return text.toLowerCase().split(' ').map(function(word) { return word.charAt(0).toUpperCase() + word.slice(1)}).join(' ');
    },
    uppercase: function(text) {
        return text.toUpperCase();
    }
}

module.exports = obj;
