const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const s3 = new S3Client();
const dynamo = new DynamoDBClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST"
};

module.exports.handler = async (event) => {
  // console.log("==== Lambda Triggered ====\n", JSON.stringify(event));

  let owner_name, cleaner_name, base64_image, price;
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : (event.body || {});
    ({ owner_name, cleaner_name, base64_image, price } = body);
    if (!owner_name || !cleaner_name || !base64_image) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "owner_name, cleaner_name and base64_image are required" })
      };
    }
  } catch (error) {
    console.error("Error parsing event body:", error);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Invalid JSON in request body" })
    };
  }

  try {
    const item_id = crypto.randomUUID();
    // Support optional data URI prefix
    const cleaned = base64_image.includes(",") ? base64_image.split(",").pop() : base64_image;
    const buffer = Buffer.from(cleaned, "base64");
    const bucket = process.env.BUCKET_NAME;
    const tableName = process.env.ITEMS_TABLE;

    const s3Key = `items/${item_id}.jpg`;

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: "image/jpeg"
    }));

    const photo_url = `https://${bucket}.s3.amazonaws.com/${s3Key}`;

    const numericPrice = Number(price);
    const priceValue = Number.isFinite(numericPrice) && numericPrice > 0 ? String(numericPrice) : "1";

    const item = {
      item_id: { S: item_id },
      owner_name: { S: owner_name },
      cleaner_name: { S: cleaner_name },
      photo_url: { S: photo_url },
      timestamp: { S: new Date().toISOString() },
      price: { N: priceValue },
      status: { S: "open" }
    };

    await dynamo.send(new PutItemCommand({
      TableName: tableName,
      Item: item
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Item logged", item_id, photo_url })
    };
  } catch (err) {
    console.error("Error handling logItem:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || "Server error" })
    };
  }
};
