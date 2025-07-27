const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    console.log("==== Lambda Triggered ====");
    console.log("Raw event:", JSON.stringify(event));

    const { item_id } = event.queryStringParameters || {};

    if (!item_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing item_id" }),
      };
    }

    const tableName = process.env.ITEMS_TABLE;

    await docClient.send(new DeleteCommand({
      TableName: tableName,
      Key: { item_id },
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Item deleted", item_id }),
    };
  } catch (err) {
    console.error("Error deleting item:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
