var ses = require('node-ses')

module.exports = function (job) {
  return new Promise(function (resolve, reject) {
    console.log('mail : ' + job.data.body.mail);
    let mail_client = ses.createClient({ key: process.env.AWS_ID, secret: process.env.AWS_SECRET });
    let server = 'localhost'
    if (process.env.TEST_ENVIRONMENT == 'false') {
      server = process.env.AWS_EC2_INSTANCE_PUBLIC_DNS + ':' + process.env.AWS_EC2_INSTANCE_PORT
    }
    let file_url = server + '/download/' + job.data.ocr_path
    mail_client.sendEmail({
      to: job.data.body.mail
      , from: process.env.AWS_SES_EMAIL_ADDRESS_IDENTITY
      , subject: 'Mail OCR: ' + job.data.ocr_path + ' is ready for download.'
      , message: '<a href="' + file_url + '">' + 'Click here</a> ( ' + file_url + ' ) to download your PDF file.'
      , altText: 'plain text'
    }, function (err, data, res) {
      if (err) {
        reject(err);
      }
      console.log('Sent mail to ' + job.data.body.mail)
      resolve(job);
    });
  });
}