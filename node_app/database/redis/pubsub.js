var pubsub = function (key) {
    let client = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
    return new Promise(function (resolve, reject) {
        let original_key = new String(key).valueOf().trim()

        client.subscribe('__keyevent@0__:set', key);

        client.on('message', function (channel, received_key) {
            let tested_key = new String(received_key).valueOf().trim()
            console.log(original_key + ' : ' + tested_key)
            if (original_key == tested_key) {
                console.log('ACCEPTED')
                client.quit()
                resolve(key)
            }
        });
    });
}

module.exports = pubsub