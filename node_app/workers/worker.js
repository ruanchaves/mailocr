// processor.js
var child = require('child_process');

module.exports = function (job) {
  let complete_path = process.env.DESTINATION + '/' + job.data.path
  let complete_ocr_path = process.env.DESTINATION + '/' + job.data.ocr_path
  console.log("processing: " + complete_ocr_path)
  let lang_string = job.data.body.languages.trim().replace(/ /g, '+')
  console.log("worker - languages :" + job.data.body.languages)
  let cmd = ''
  if (process.env.TEST_ENVIRONMENT == 'true' ) {
    cmd = "echo 'worker echo test' > " + complete_ocr_path
    child.execSync(cmd)
    cmd = 'sleep 60'
    child.execSync(cmd)
  }
  else {
    try {
      cmd = "pdfsandwich -lang " + lang_string + " "  + complete_path + " -o " + complete_ocr_path
      child.execSync(cmd)      
    } catch (error) {
      console.log(error)
    }
  }
  return job;
}