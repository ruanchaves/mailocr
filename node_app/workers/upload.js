const fs = require('fs');
const s3 = require(process.env.AWS_S3_PATH + '/s3.js')

module.exports = function (job) {
    return new Promise(function (resolve, reject) {
        let complete_ocr_path = process.env.DESTINATION + '/' + job.data.ocr_path

        // Read content from the file
        const fileContent = fs.readFileSync(complete_ocr_path);

        // Setting up S3 upload parameters
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: job.data.ocr_path, // File name you want to save as in S3
            Body: fileContent
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            resolve(job)
        });
    });
}