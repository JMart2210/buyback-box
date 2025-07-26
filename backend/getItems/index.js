import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const owner_name = queryParams.owner_name;

    if (!owner_name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing owner_name parameter" })
      };
    }

    const tableName = process.env.ITEMS_TABLE;

    const scan = await dynamo.send(new ScanCommand({
      TableName: tableName,
      FilterExpression: "#o = :owner AND #s = :status",
      ExpressionAttributeNames: {
        "#o": "owner_name",
        "#s": "status"
      },
      ExpressionAttributeValues: {
        ":owner": { S: owner_name },
        ":status": { S: "open" }
      }
    }));

    const results = scan.Items.map(item => ({
      item_id: item.item_id.S,
      photo_url: item.photo_url.S,
      cleaner_name: item.cleaner_name.S,
      timestamp: item.timestamp.S,
      price: item.price.N
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ items: results })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
