import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/products',
        responseData: {
          200: {
            description: 'Product object',
            bodyType: 'Product',
          },
          400: {
            description: 'Bad request',
          },
          500: {
            description: 'Something went wrong!',
          },
        }
      },
    },
  ],
};
