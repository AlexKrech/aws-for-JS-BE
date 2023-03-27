import type { AWS } from '@serverless/typescript';
import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';
import {UPLOAD_S3_BUCKET} from "./src/constants/constants";

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    httpApi: {
      cors: true
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
              "s3:PutObject",
              "s3:GetObject",
              "s3:DeleteObject",
              "s3:ListBucket",
            ],
            Resource: [
              `arn:aws:s3:::${UPLOAD_S3_BUCKET}/*`,
              `arn:aws:s3:::${UPLOAD_S3_BUCKET}`,
            ],
          },
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
