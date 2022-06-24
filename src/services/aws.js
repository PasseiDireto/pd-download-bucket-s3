import AWS from "aws-sdk";
import 'dotenv/config';

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const listAllObjects = (params) => new Promise((resolve, reject) => {
  s3.listObjects(params, (error, data) => {
    if (error) {
      return reject(error);
    }
    return resolve(data);
  });
});

const getObject = (params) => new Promise((resolve, reject) => {
  s3.getObject(params, (error, data) => {
    if (error) {
      return reject(error);
    }
    return resolve(data);
  });
});

export {
  listAllObjects,
  getObject
}