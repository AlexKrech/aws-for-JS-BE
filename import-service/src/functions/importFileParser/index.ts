import { handlerPath } from '@libs/handler-resolver';
import {UPLOAD_S3_BUCKET} from "../../constants/constants";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: UPLOAD_S3_BUCKET,
        event: "s3:ObjectCreated:*",
        rules: [
          {
            prefix: "uploaded/",
          },
        ],
        existing: true,
      },
    }
  ],
};
