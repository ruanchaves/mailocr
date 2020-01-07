var child = require('child_process')

module.exports = function (job) {
    let complete_path = process.env.DESTINATION + '/' + job.data.path
    
    console.log('remove: ' + job.data.path)

    let cmd = ""
    try {
        cmd = 'rm ' + '"' + complete_path.split('.' + complete_path.split('.')[1])[0] + '"' + "*"
        child.execSync(cmd)     
    } catch (error) {
        console.log(error)
    }

    return job
}