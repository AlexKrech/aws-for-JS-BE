import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, ScanCommand} from "@aws-sdk/lib-dynamodb";
import {formatJSONResponse} from "@libs/api-gateway";
import {StatuseCodeList} from "../../constants/statuse-code-list";
import {IProductItemData, IStockData} from "../../types/product-data";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  console.log('Getting products list was called!');

  try {
    const client = new DynamoDBClient({ region: process.env.DB_REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const getProducts = new ScanCommand({
      TableName: process.env.PRODUCT_TABLE_NAME,
    });
    const getProductsStock = new ScanCommand({
      TableName: process.env.STOCK_TABLE_NAME,
    });

    const products = (await ddbDocClient.send(getProducts))?.Items as IProductItemData[];
    const stocks = (await ddbDocClient.send(getProductsStock))?.Items as IStockData[];

    const joinedProducts = products.map((product) => ({
      ...product, count: stocks.find(stock => stock.product_id === product.id)?.count
    }))
    return formatJSONResponse(StatuseCodeList.OK, joinedProducts)
  } catch (err) {
    return formatJSONResponse(StatuseCodeList.SOMETHING_WENT_WRONG, 'Something went wrong!')
  }
};

export const main = getProductsList;