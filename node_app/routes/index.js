var express = require('express');
var router = express.Router();
var multer = require('multer');

var StorageEngine = require(process.env.REDIS_PATH + '/storage.js')

var s3 = require(process.env.AWS_S3_PATH + '/s3.js')

// var pubsub = require(process.env.REDIS_PATH + '/pubsub.js')

var client = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);

var storage = StorageEngine({
    destination: function (req, file, cb) {
        console.log('destination : ' + req.body.languages)
        cb(null, process.env.DESTINATION)
    },
    filename: function (req, file, cb) {
        console.log('filename: ' + req.body.languages)
        let path = file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.originalname.split('.')[1]
        path = path.replace(/ /g, '_')
        cb(null, path)
    }
});

var upload = multer({ storage: storage })

router.post('/upload', upload.single('pdf'), function (req, res, next) {
    console.log(req.body)
    res.sendStatus(200);
});

router.get('/download/:url', function (req, res, next){
    let url = req.params.url
    let signed_url = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: url,
        Expires: parseInt(process.env.AWS_SIGNED_URL_EXPIRE_SECONDS)
    });
    res.redirect(signed_url);
})

module.exports = router;
