import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import {defaultHeaders} from "../constants/default-headers";
import {jsonType} from "../types/json-types";
import {StatuseCodeList} from "../constants/statuse-code-list";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (statusCode: StatuseCodeList, response: jsonType) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
    headers: {...defaultHeaders}
  }
}
