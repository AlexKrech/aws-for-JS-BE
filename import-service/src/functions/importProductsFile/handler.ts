import {formatJSONResponse} from "@libs/api-gateway";
import {StatuseCodeList} from "../../constants/statuse-code-list";
import {APIGatewayProxyHandler} from "aws-lambda";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const importProductsFile: APIGatewayProxyHandler = async event => {
  console.info(`importProductsFile. Incoming event: ${JSON.stringify(event)}`);

  try {
    const catalogName = event.queryStringParameters.name;
    const catalogPath = `uploaded/${catalogName}`;

    const client = new S3Client({ region: "eu-west-1" });

    try {
      const command = new PutObjectCommand( { Bucket: "import-service-alex-krech", Key: catalogPath });

      const url = await getSignedUrl(client, command, { expiresIn: 60 });
      return formatJSONResponse(StatuseCodeList.OK, url)
    }
    finally {
      client.destroy();
    }
  }
  catch (e) {
    console.error(`importProductsFile. Error: ${e.stack}`);
    return formatJSONResponse(StatuseCodeList.SOMETHING_WENT_WRONG, 'Something went wrong!')
  }
};

export const main = importProductsFile;