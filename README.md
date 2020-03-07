<p align="center">
  <a href="http://ec2-34-227-113-227.compute-1.amazonaws.com:3000/"><img src="https://pdfsandwich.s3.amazonaws.com/logo.png"></a>
</p>

# <a href="http://ec2-34-227-113-227.compute-1.amazonaws.com:3000/">mailocr</a>

[**mailocr**](http://ec2-34-227-113-227.compute-1.amazonaws.com:3000/) is a tool for converting images and scanned PDFs into searchable PDF files. After conversion is completed, a link to download the files is mailed to the user.

I wrote it after searching for OCR tools online and finding out that most of them didn't support all languages provided by Tesseract. I also didn't like the idea of having to leave a browser tab open until the entire conversion process was finished ( as for large files most of the time the tab would crash before it happened ).

Under the hood, it's a graphical user interface for the [Tesseract 4.0 OCR Engine](https://github.com/tesseract-ocr/tesseract). It starts a Node.js server that passes file uploads through [img2pdf](https://gitlab.mister-muffin.de/josch/img2pdf) and/or [pdfsandwich](http://www.tobias-elze.de/pdfsandwich/) with the help of Redis queues.

# Setup

1. **First step: AWS setup**
    1. [Create an Amazon S3 Bucket](https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-1-create-bucket.html). You may also want to create a [lifetime policy](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-lifecycle.html) for your bucket.
    1. Follow the [Amazon Simple Email Service Quick Start guide](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/quick-start.html) to set up your mail account. Make sure you [step out of the sandbox](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html) if you want to send emails to someone other than yourself.
    1. Create an [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) that has full access to S3 and SES. Then [generate an AWS access key](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/) for your user.

1. **Second step: Project setup**
    1. Clone this project: `git clone https://github.com/ruanchaves/mailocr.git`
    1. Add your `AWS_ID` and your `AWS_SECRET` to the [example](https://github.com/ruanchaves/mailocr/blob/master/example) file. Rename the value under `AWS_S3_BUCKET_NAME` to the name of your S3 bucket, `AWS_SES_EMAIL_ADDRESS_IDENTITY` to the email that you have registered under AWS SES, and `AWS_EC2_INSTANCE_PUBLIC_DNS` to `localhost`.
    2. Rename the `example` file to `node.env`.
    3. Install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/), and then execute `docker-compose up` on the root folder of this project. After this command, the server will be available on `http://localhost:3000/`.
    4. (Optional) You can also [deploy it to EC2](https://medium.com/@umairnadeem/deploy-to-aws-using-docker-compose-simple-210d71f43e67). Remember to change `AWS_EC2_INSTANCE_PUBLIC_DNS` under the environment settings to your server address.

# Contribute

We welcome contributions to **mailocr** of any kind. Please send your pull requests to improve documentation, bug fixes, tests and proposed/accepted features.
