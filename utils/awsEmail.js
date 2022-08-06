// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 

// Amazon SES configuration
const SESConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: "AKIAQNY6Z3BKKHF6QIF3",
    secretAccessKey: "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",
    region: "us-east-1"
  };

var params = {
    Source: 'wantwi28@gmail.com',
    Destination: {
      ToAddresses: [
        'wantwi28@yahoo.com',]
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: 'IT IS <strong>WORKING</strong>!'
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Node + SES Example'
      }
    }
  };
  
  const sendPromise =""// new AWS.SES(SESConfig).sendEmail(params).promise()




module.exports = sendPromise;

// Handle promise's fulfilled/rejected states
// sendPromise.then(
//   function(data) {
//     console.log(data.MessageId);
//   }).catch(
//     function(err) {
//     console.error(err, err.stack);
//   });

