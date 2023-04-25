import type { AWS } from '@serverless/typescript';
import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';
import {QUEUE_NAME, UPLOAD_S3_BUCKET} from "./src/constants/constants";

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    httpApi: {
      cors: true,
      authorizers: {
        httpApiAuthorizer: {
          name: 'httpApiAuthorizer',
          type: 'request',
          payloadVersion: '2.0',
          resultTtlInSeconds: 0,
          identitySource: ['$request.header.Authorization'],
          functionArn:
              'arn:aws:lambda:eu-west-1:097240409898:function:authorization-service-dev-basicAuthorizer'
        }
      }
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DB_REGION: "eu-north-1",
      PRODUCT_TABLE_NAME: "Product-table",
      STOCK_TABLE_NAME: "Stock-table",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "s3:*",
            ],
            Resource: [
              `arn:aws:s3:::${UPLOAD_S3_BUCKET}/*`,
              `arn:aws:s3:::${UPLOAD_S3_BUCKET}`,
            ],
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: `arn:aws:sqs:eu-west-1:097240409898:${QUEUE_NAME}`,
          }
        ],
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
