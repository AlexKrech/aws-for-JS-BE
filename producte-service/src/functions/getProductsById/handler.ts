import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {productsList} from "../../../mocks/products-list";
import {formatJSONResponse} from "@libs/api-gateway";
import {StatuseCodeList} from "../../constants/statuse-code-list";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const id = event?.pathParameters?.id;
  if (!id) {
    return formatJSONResponse(StatuseCodeList.BAD_REQUEST, 'Bad request, no ID is passed')
  }
  const product = productsList.find(obj => obj.id === id);
  if (product) {
    return formatJSONResponse(StatuseCodeList.OK, product)
  } else {
    return formatJSONResponse(StatuseCodeList.NOT_FOUND, 'Product not found')
  }
};

export const main = getProductsById;