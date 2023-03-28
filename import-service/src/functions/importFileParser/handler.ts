import {S3} from "aws-sdk";
import {UPLOAD_S3_BUCKET} from "../../constants/constants";
import {Handler} from "aws-lambda";
import * as path from "path";
import csvParser = require("csv-parser");

const importFileParser: Handler = async (event) => {
  try {
    const s3 = new S3();
    console.log("import file parser event", event);
    for (const record of event.Records) {
      const objectKey = record.s3.object.key;
      console.log("objectKey", objectKey);
      if (objectKey) {
        const params = {
          Bucket: UPLOAD_S3_BUCKET,
          Key: objectKey,
        };

        const parse = (stream) =>
            new Promise((_resolve, reject) => {
              stream.on("data", (data) => console.log("Record:", data));
              stream.on("error", (error) => {
                console.log(error);
                reject();
              });
              stream.on("end", async () => {
                console.log("Finish parsing CSV file");
                try {
                  const dstKey = path.join("parsed", path.basename(objectKey));

                  const copyParams = {
                    Bucket: UPLOAD_S3_BUCKET,
                    CopySource: `/${UPLOAD_S3_BUCKET}/${objectKey}`,
                    Key: objectKey.replace('uploaded', 'parsed'), //replace
                  };

                  await s3.copyObject(copyParams).promise();
                  console.log(`File was copied to ${dstKey}`);
                  await s3.deleteObject(params).promise();
                  console.log(`File was deleted from ${objectKey}`);
                } catch (err) {
                  console.log(`Error copying or deleting file: ${err}`);
                }
              });
            });

        const s3Stream = s3.getObject(params).createReadStream();

        await parse(s3Stream.pipe(csvParser()));
      }
    }
  } catch (err) {
    console.log('Something went wrong!')
  }
};

export const main = importFileParser;