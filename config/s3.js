

const AWS = require('aws-sdk');


const s3 = new AWS.S3({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.ACCESS_SECRET_KEY_AWS
});

/**
 * upload file to aws s3
 * @param {*} file
 */
async function uploadFileToAws(file, category) {


    const fileName = `${new Date().getTime()}_${category}_${file.name}`;
    const mimetype = file.mimetype;
    const params = {
        Bucket: `switchupxperience/${category}`,
        Key: fileName,
        Body: file.data,
        ContentType: mimetype
    };
    const res = await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => err == null ? resolve(data) : reject(err));
    });
    return { fileUrl: res.Location };
}

module.exports = {
    uploadFileToAws
};