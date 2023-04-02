import {createProduct} from "@functions/createProduct/handler";
import {SNS} from "aws-sdk";

export const catalogBatchProcess = async (event) => {
  console.log("catalogBatchProcess called!");
  const products = event.Records.map(({ body }) => JSON.parse(body));

  if (!products || !products?.length) {
    throw new Error("No records found!");
  }

  try {
    for (const product of products) {
      console.log("product ", product)
      await createProduct({body: JSON.stringify(product)});
      const sns = new SNS();

      const message = {
        Subject: 'Product was added',
        Message: JSON.stringify(product),
        TopicArn: process.env.SNS_ARN,
      };
      await sns.publish(message).promise();
    }
  } catch (error) {
    console.log("Something went wrong!", error)
  }
};

export const main = catalogBatchProcess;