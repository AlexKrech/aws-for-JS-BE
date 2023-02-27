import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {productsList} from "../../../mocks/products-list";
import {defaultHeaders} from "../../config/defaultHeaders";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const id = event?.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: 'Bad request, no ID is passed',
      headers: {...defaultHeaders}
    };
  }
  const product = productsList.find(obj => obj.id === id);
  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
      headers: {...defaultHeaders}
    };
  } else {
    return {
      statusCode: 404,
      body: 'Product not found',
      headers: {...defaultHeaders}
    };
  }
};

export const main = getProductsById;