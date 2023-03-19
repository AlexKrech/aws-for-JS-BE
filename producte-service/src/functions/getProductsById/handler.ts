import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONResponse} from "@libs/api-gateway";
import {StatuseCodeList} from "../../constants/statuse-code-list";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, GetCommand} from "@aws-sdk/lib-dynamodb";
import {IProductItemData, IStockData} from "../../types/product-data";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('Getting product by id was called!');
  console.log('Event:', event);
  try {
    const id = event?.pathParameters?.id;
    console.log("id => ", id)

    if (!id) {
      return formatJSONResponse(StatuseCodeList.BAD_REQUEST, 'Bad request, no ID is passed')
    }

    const client = new DynamoDBClient({ region: process.env.DB_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const getProducts = new GetCommand({
      TableName: process.env.PRODUCT_TABLE_NAME,
      Key: {
        id: id
      }
    });
    const getProductsStock = new GetCommand({
      TableName: process.env.STOCK_TABLE_NAME,
      Key: {
        product_id: id,
      }
    });

    const product = (await ddbDocClient.send(getProducts))?.Item as IProductItemData;
    const stock = (await ddbDocClient.send(getProductsStock))?.Item as IStockData;

    const joinedProducts = {
      ...product,
      count: stock.count
    }

    if (joinedProducts) {
      return formatJSONResponse(StatuseCodeList.OK, joinedProducts)
    } else {
      return formatJSONResponse(StatuseCodeList.NOT_FOUND, 'Product not found')
    }
  } catch (err) {
    return formatJSONResponse(StatuseCodeList.SOMETHING_WENT_WRONG, err)
  }
};

export const main = getProductsById;