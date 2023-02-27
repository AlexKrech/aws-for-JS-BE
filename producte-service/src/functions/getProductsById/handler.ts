import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {productsList} from "../../../mocks/products-list";
import {defaultHeaders} from "../../config/defaultHeaders";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(productsList),
    headers: {...defaultHeaders}
  };
};

export const main = getProductsList;