import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import {productsList} from "../mocks/products-list";

(async () => {
    const client = new DynamoDBClient({ region: 'eu-north-1' });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
    try {
        const productsOutput = await Promise.all(
            productsList.map(item => {
                const command = new PutCommand({ TableName: 'Product-table', Item: {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    price: item.price
                }});
                return ddbDocClient.send(command);
            })
        );
        console.log(productsOutput);

        const stockOutput = await Promise.all(
            productsList.map(item => {
                const command = new PutCommand({ TableName: 'Stock-table', Item: {
                    product_id: item.id,
                    count: item.count
                }});
                return ddbDocClient.send(command);
            })
        );
        console.log(stockOutput);
    } catch (err) {
        console.error(err);
    }
})();




