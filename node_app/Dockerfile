FROM ubuntu:16.04

RUN apt-get update && apt-get -y install tesseract-ocr

RUN apt-get update && apt-get -y install python3-pip
RUN pip3 install img2pdf

ADD https://pdfsandwich.s3.amazonaws.com/pdfsandwich_0.1.7_amd64.deb pdfsandwich_0.1.7_amd64.deb
RUN apt-get -fy install ./pdfsandwich_0.1.7_amd64.deb
RUN sed -i 's/rights=\"none\"/rights=\"read\|write\"/g' /etc/ImageMagick-6/policy.xml

ADD https://deb.nodesource.com/setup_13.x setup_13.sh
RUN bash setup_13.sh
RUN apt-get install -y nodejs

## All Tesseract languages
RUN apt-get update && apt-get -y install tesseract-ocr-all

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]