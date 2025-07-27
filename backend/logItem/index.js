const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");


const s3 = new S3Client();
const dynamo = new DynamoDBClient();

module.exports.handler = async (event) => {
  // console.log("==== Lambda Triggered ====");
  // console.log("Raw event from API Gateway:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body);
    const { owner_name, cleaner_name, base64_image } = body;

    console.log("Parsed body:", { owner_name, cleaner_name, base64_length: base64_image.length });
  } catch (error) {
    console.error("Error parsing event body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON in request body" })
    };
  }

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
