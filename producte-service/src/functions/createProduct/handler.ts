import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import {formatJSONResponse} from "@libs/api-gateway";
import {StatuseCodeList} from "../../constants/statuse-code-list";
import { v4 } from 'uuid';

const createProduct = async (event: {body: string}) => {
  console.log('Creating product was called!');
  console.log('Event:', event);

  try {
    const { body } = event;
    const { title, description, price, count } = JSON.parse(body);

    if (!title || !description || !price || !count) {
      return formatJSONResponse(StatuseCodeList.BAD_REQUEST, 'Product data is invalid!')
    }

    const client = new DynamoDBClient({ region: process.env.DB_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
    const productId = v4();

    const createProducts = new PutCommand({
      TableName: process.env.PRODUCT_TABLE_NAME,
      Item: { id: productId, title, description, price }
    });
    const createProductStock = new PutCommand({
      TableName: process.env.STOCK_TABLE_NAME,
      Item: { product_id: productId, count }
    });

    await ddbDocClient.send(createProducts)
    await ddbDocClient.send(createProductStock)

    const joinedProducts = {
      id: productId,
      title,
      description,
      price,
      count
    }
    return formatJSONResponse(StatuseCodeList.OK, joinedProducts)
  } catch (err) {
    return formatJSONResponse(StatuseCodeList.SOMETHING_WENT_WRONG, 'Something went wrong!')
  }
};

export const main = createProduct;