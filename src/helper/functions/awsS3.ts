import { default as AWS } from "aws-sdk";
import getRandomString from "./getRandomString";

const signed_url_expire_seconds: number = parseInt(
  process.env.SIGNED_URL_EXPIRE_SECONDS as string,
  10
);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  signatureVersion: "v4",
  region: process.env.AWS_CLOUD_REGION,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

export const generateUniqueFileName = (file_name: string) => {
  const sanitizedFilename = file_name
    .replace(/[&!@#$%^&*()-+=`~;:{}'",?/<>[\]\s]/g, "_")
    .toLowerCase();

  return `${process.env.NODE_ENV}/${getRandomString()}_${sanitizedFilename}`;
};

export const getObjectUrl = async (
  key: string,
  bucket_name: string
): Promise<string> => {
  const url = s3.getSignedUrl("getObject", {
    Bucket: bucket_name,
    Key: key,
    Expires: signed_url_expire_seconds,
  });
  // console.log("Object url", url);
  return url;
};

export const uploadFile = async (
  file: Buffer,
  file_name: string,
  options: {
    bucket_name: string;
    preserve_original_name?: boolean;
  }
) => {
  const key = options.preserve_original_name
    ? file_name
    : generateUniqueFileName(file_name);

  const uploaded_file = await s3
    .upload({
      Bucket: options.bucket_name,
      Key: key,
      Body: file,
    })
    .promise();
  // console.log("uploaded_file", uploaded_file);
  return uploaded_file;
};

export const deleteFile = async (key: string, bucket_name: string) => {
  await s3
    .deleteObject({
      Bucket: bucket_name,
      Key: key,
    })
    .promise();
};
