import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const s3 = new S3Client();
const dynamo = new DynamoDBClient();

export const handler = async (event) => {
  const body = JSON.parse(event.body);

  const { owner_name, cleaner_name, base64_image } = body;

  const item_id = crypto.randomUUID();
  const buffer = Buffer.from(base64_image, "base64");
  const bucket = process.env.BUCKET_NAME;
  const tableName = process.env.ITEMS_TABLE;

  const s3Key = `items/${item_id}.jpg`;

  // Upload to S3
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg"
  }));

  const photo_url = `https://${bucket}.s3.amazonaws.com/${s3Key}`;

  // Add record to DynamoDB
  const item = {
    item_id: { S: item_id },
    owner_name: { S: owner_name },
    cleaner_name: { S: cleaner_name },
    photo_url: { S: photo_url },
    timestamp: { S: new Date().toISOString() },
    price: { N: "1" },
    status: { S: "open" }
  };

  await dynamo.send(new PutItemCommand({
    TableName: tableName,
    Item: item
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Item logged", item_id })
  };
};
