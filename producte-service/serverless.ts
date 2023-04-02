import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

import {QUEUE_NAME, TOPIC} from "./src/constants/constants";

const serverlessConfiguration: AWS = {
  service: 'producte-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
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
      SNS_ARN: {
        Ref: 'SnsTopic'
      }
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:*',
            Resource: `*`,
          },
          {
            Effect: "Allow",
            Action: ["sns:*"],
            Resource: `arn:aws:sns:eu-west-1:*:${TOPIC}`,
          },
        ],
      },
    },
  },

  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      SqsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: QUEUE_NAME,
        },
      },
      SnsTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: TOPIC,
        },
      },
      SnsSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "alexkrech1997@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SnsTopic",
          },
        },
      },
    }
  },
  package: { individually: true },
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
    autoswagger: {
      basePath: '/dev',
      host: 'ymw2ch5lk2.execute-api.eu-west-1.amazonaws.com'
    }
  },
};

module.exports = serverlessConfiguration;
