const express = require('express');
var router = express.Router();
const settings = require('./../../wallets/all_settings');

const walletRoute = require('./wallet');
router.use('/:wallet',function(req, res, next){
    if(!settings[req.params['wallet']]) {
        res.send('wallet not found');
        return;
    }
    res.header("Content-Type",'application/json');
    res.locals.wallet = req.params['wallet'];
    next();
}, walletRoute);

var string = "";
for (var wallet in settings) {
    var txid = settings[wallet].example_txid;
    var hash = settings[wallet].example_hash;
    var dev_address = settings[wallet].dev_address;
    var currentRoute;
    string += '<h2>' + wallet + ' api</h2>' + '<br>';
    for(var i in walletRoute.stack) {
        if(walletRoute.stack[i] && walletRoute.stack[i].route) {
            currentRoute = ('/api/' + wallet + walletRoute.stack[i].route.path
                .replace(':hash', hash)
                .replace(':number', 1)
                .replace(':address', dev_address)
                .replace(':coin', wallet)
                .replace(':limit', 10)
                .replace(':symbol', wallet.replace('dogecash', 'dogec').toUpperCase() + '_' + 'BTC')
                .replace(':offset', 0)
                .replace(':verbose', 1)
                .replace(':txid', txid));
            addLinkToString(currentRoute);
        }
    }
}
function addLinkToString(route) {
    // string += "<a href='" + route + "' target='_blank'>" + route + "</a>";
    // string += '<br>';
}

router.get("/", function(req, res) {
    res.send(string);
});
module.exports = router;
