// Create a DocumentClient that represents the query to add an item
import DynamoDB from 'aws-sdk/clients/dynamodb';


// Declare some custom client just to illustrate how TS will include only used files into lambda distribution
export default class CustomDynamoClient {
    table: string = "sam-prod-table";
    docClient: DynamoDB.DocumentClient = new DynamoDB.DocumentClient();

    async readAll() {
        const data = await this.docClient.scan({ TableName: this.table }).promise();
        return data.Items;
    }

    // async read(id: any) {
    //     var params = {
    //         TableName : this.table,
    //         Key: { id: id },
    //     };
    //     const data = await this.docClient.get(params).promise();
    //     return data.Item;
    // }

    async delete(id: string){
        console.log("inside dynamodb client ---- delete triggered id is "+id)

        const params = {
            TableName: this.table,
            Key:  {
                productID: id,
            },
        };

        await this.docClient.delete(params).promise();

        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Item deleted successfully',
            }),
        }
    }

    async write(Item: object) {
        const params = {
            TableName: this.table,
            Item,
        };

        return await this.docClient.put(params).promise();
    }
}