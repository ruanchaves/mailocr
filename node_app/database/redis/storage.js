var fs = require('fs')
var os = require('os')
var path = require('path')
var crypto = require('crypto')
var mkdirp = require('mkdirp')

const redis = process.env.REDIS_URL + ':' + process.env.REDIS_PORT
var Queue = require('bull');

var imageQueue = new Queue('image to pdf', redis);
var pdfQueue = new Queue('pdf transcoding', redis);
var s3Queue = new Queue('s3 upload', redis);
var delQueue = new Queue('file deletion', redis);
var mailQueue = new Queue('mail sending', redis);

imageQueue.process(process.env.WORKERS + '/image.js');
pdfQueue.process(process.env.WORKERS + '/worker.js');
s3Queue.process(process.env.WORKERS + '/upload.js');
delQueue.process(process.env.WORKERS + '/delete.js');
mailQueue.process(process.env.WORKERS + '/mail.js');

imageQueue.on('completed', (job) => {
  pdfQueue.add({
    "path": job.data.conv_path,
    "ocr_path": job.data.ocr_path,
    "body": job.data.body
  })
})

pdfQueue.on('completed', (job) => {
  s3Queue.add({
    "path": job.data.path,
    "ocr_path": job.data.ocr_path,
    "body": job.data.body
  })
})

s3Queue.on('completed', (job) => {
  delQueue.add({
    "path": job.data.path,
    "ocr_path": job.data.ocr_path,
    "body": job.data.body
  })
})

delQueue.on('completed', (job) => {
  mailQueue.add({
    "path": job.data.path,
    "ocr_path": job.data.ocr_path,
    "body": job.data.body
  })
})

function getFilename(req, file, cb) {
  crypto.pseudoRandomBytes(16, function (err, raw) {
    cb(err, err ? undefined : raw.toString('hex'))
  })
}

function getDestination(req, file, cb) {
  cb(null, os.tmpdir())
}

function DiskStorage(opts) {
  this.getFilename = (opts.filename || getFilename)

  if (typeof opts.destination === 'string') {
    mkdirp.sync(opts.destination)
    this.getDestination = function ($0, $1, cb) { cb(null, opts.destination) }
  } else {
    this.getDestination = (opts.destination || getDestination)
  }
}

DiskStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  var that = this

  that.getDestination(req, file, function (err, destination) {
    if (err) return cb(err)

    that.getFilename(req, file, function (err, filename) {
      if (err) return cb(err)

      var finalPath = path.join(destination, filename)
      var outStream = fs.createWriteStream(finalPath)

      file.stream.pipe(outStream)
      outStream.on('error', cb)
      outStream.on('finish', function () {

        // run OCR
        console.log('destination ' + destination)
        console.log('filename: ' + filename)
        console.log('finalPath: ' + finalPath)

        let path = ''
        let ocr_path = ''
        let conv_path = ''
        if (filename.endsWith('pdf')) {
          console.log("if :")
          path = filename
          ocr_path = path.split('.' + filename.split('.')[1])[0] + '_ocr.pdf'

          pdfQueue.add({
            "path": path,
            "ocr_path": ocr_path,
            "body": req.body
          })
        }
        else {
          console.log("else : ")
          path = filename
          ocr_path = path.split('.' + filename.split('.')[1])[0] + '_ocr.pdf'
          conv_path = path.split('.' + filename.split('.')[1])[0] + '.pdf'
          console.log(conv_path)
          imageQueue.add({
            "path": path,
            "conv_path": conv_path,
            "ocr_path": ocr_path,
            "body": req.body
          })
        }

        cb(null, {
          destination: destination,
          filename: filename,
          path: finalPath,
          size: outStream.bytesWritten
        })
      })
    })
  })
}

DiskStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  var path = file.path

  delete file.destination
  delete file.filename
  delete file.path

  fs.unlink(path, cb)
}

module.exports = function (opts) {
  return new DiskStorage(opts)
}
