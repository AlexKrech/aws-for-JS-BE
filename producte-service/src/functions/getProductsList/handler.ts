import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {productsList} from "../../../mocks/products-list";
import {formatJSONResponse} from "@libs/api-gateway";
import {StatuseCodeList} from "../../constants/statuse-code-list";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  return formatJSONResponse(StatuseCodeList.OK, productsList)
};

export const main = getProductsList;