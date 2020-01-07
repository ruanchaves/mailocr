// processor.js
var child = require('child_process');

module.exports = function (job) {
    let complete_path = process.env.DESTINATION + '/' + job.data.path
    let complete_conv_path = process.env.DESTINATION + '/' + job.data.conv_path
    let cmd = "python3 " + process.env.WORKERS + "/convert.py " + complete_path + " " + complete_conv_path
    try {
        child.execSync(cmd);
    } catch (error) {
        console.log("image.js : " + error);
    }
    return job;
}