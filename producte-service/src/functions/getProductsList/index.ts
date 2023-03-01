import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products',
        cors: true,
        responseData: {
          200: {
            description: 'Product list',
            bodyType: 'ProductList',
          },
        }
      },
    },
  ],
};
