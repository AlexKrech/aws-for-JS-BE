import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONResponse} from "@libs/api-gateway";
import {StatuseCodeList} from "../../constants/statuse-code-list";
import {S3} from "aws-sdk";
import {UPLOAD_S3_BUCKET} from "../../constants/constants";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  try {
    console.log("importProductsFile", event);

    const S3Bucket = new S3();
    const params = {
      Bucket: UPLOAD_S3_BUCKET,
      Key: `uploaded/${event.queryStringParameters.name}`,
      ACL: "public-read",
      ContentType: "text/csv",
    };
    const url = await S3Bucket.getSignedUrlPromise("putObject", params);

    return formatJSONResponse(StatuseCodeList.OK, url)
  } catch (err) {
    return formatJSONResponse(StatuseCodeList.SOMETHING_WENT_WRONG, 'Something went wrong!')
  }
};

export const main = importProductsFile;