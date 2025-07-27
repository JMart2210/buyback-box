const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const tableName = process.env.ITEMS_TABLE;
    const { owner_name, status } = event.queryStringParameters || {};

    if (!owner_name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing owner_name parameter" }),
      };
    }

    // Build dynamic filter
    let filterExpression = "owner_name = :o";
    let expressionValues = { ":o": owner_name };

    if (status) {
      filterExpression += " AND #s = :s";
      expressionValues[":s"] = status;
    }

    const result = await ddb.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionValues,
        ExpressionAttributeNames: status ? { "#s": "status" } : undefined,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ items: result.Items || [] }),
    };
  } catch (err) {
    console.error("Error fetching items:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

// This code is for a Lambda function that retrieves items from a DynamoDB table based on the owner_name and status parameter.
// It uses the AWS SDK for JavaScript v3 to interact with DynamoDB.