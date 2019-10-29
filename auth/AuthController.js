var express = require('express');
var router = express.Router();
var db = require('../db');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var hash = require('hash.js');
var openpgp = require('openpgp');

openpgp.initWorker({ path:'openpgp.worker.js' })

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', function(req, res) {

    db.getUserByEmail(req.body.email, function(items) {
        if (items.length == 0) {
            console.log('Error - no user found');
            return res.status(404).send('Error - No user found.');
        }

        var item = items[0];

        var hashedPwd = hash.sha256().update(req.body.password).digest('hex');

        if (hashedPwd != item.password) {
            return res.status(401).send({ auth: false, token: null });
        }

        var token = jwt.sign({ id: item.id }, process.env.SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY_SECONDS
        });

        console.log('Successfully authenticated user: ' + req.body.email);
        
        res.status(200).send({ auth: true, token: token });
    });
});
  
module.exports = router;
