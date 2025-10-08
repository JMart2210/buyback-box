const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamo = new DynamoDBClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { item_id, redeemed_by } = body;

    const tableName = process.env.ITEMS_TABLE;

    const getItem = await dynamo.send(new GetItemCommand({
      TableName: tableName,
      Key: { item_id: { S: item_id } }
    }));

    if (!getItem.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Item not found" })
      };
    }

    await dynamo.send(new UpdateItemCommand({
      TableName: tableName,
      Key: { item_id: { S: item_id } },
      UpdateExpression: "SET #s = :s, redeemed_by = :r, redeemed_at = :t",
      ExpressionAttributeNames: {
        "#s": "status"
      },
      ExpressionAttributeValues: {
        ":s": { S: "redeemed" },
        ":r": { S: redeemed_by },
        ":t": { S: new Date().toISOString() }
      }
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Item redeemed", item_id })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};
