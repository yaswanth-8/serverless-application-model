import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import CustomDynamoClient from './utils/dynamodb';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const tableName = "sam-prod-table";
const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  };

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world from yaswanthhhh : )',
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

export const lambdaHandler2 = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Heloo world 2',
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

//add a product to db
export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("create product triggered");
    try {
      if (event.httpMethod === "OPTIONS") {
        console.log("Inside options");
        return {
          statusCode: 200,
          headers: headers,
          body: "",
        };
      }
  
      const reqBody = JSON.parse(event.body as string);
      console.log("request body is " + reqBody);
      const product = {
        ...reqBody,
      };
  
      const client = new CustomDynamoClient();
        await client.write(product);
  
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(product),
      };
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify(e),
      };
    }
  };
  
//   //get a specific product
//   const fetchProductById = async (id: string) => {
//     console.log("fetchProduct by Id triggered");
//     const output = await docClient
//       .get({
//         TableName: tableName,
//         Key: {
//           productID: id,
//         },
//       })
//       .promise();
  
//     if (!output.Item) {
//       return { statusCode: 400, error: "not found" };
//     }
  
//     return output.Item;
//   };
  
//   export const getProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     console.log("get product triggered");
//     console.log(event);
//     try {
//       const product = await fetchProductById(event.pathParameters?.id as string);
  
//       return {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify(product),
//       };
//     } catch (e) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify(e),
//       };
//     }
//   };
  
  //get all products , here favorites
  export const getAllProducts = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("get all products triggered");
    console.log(event);
    try {
      const products = await fetchAllProducts();
  
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products),
      };
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify(e),
      };
    }
  };
  
  const fetchAllProducts = async () => {
    console.log("fetch All Products triggered");
    const client = new CustomDynamoClient();
    const output = await client.readAll();
  
    // if (!output.Items || output.Items.length === 0) {
    //   return { statusCode: 404, error: "No products found" };
    // }
  
    return output;
  };
  
  //delete product
  export const deleteProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("delete product triggered");
    console.log(event);
    try {
      const product = await deleteProductByID(event.pathParameters?.id as string);
  
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(product),
      };
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify(e),
      };
    }
  };
  
  const deleteProductByID = async (id: string) => {
    console.log("deleteP by Id triggered");
    console.log(id + " is the ID -------- : )");
    const client = new CustomDynamoClient();
    await client.delete(id);
  
    return { message: "item deleted with id " + id };
  };
  