// This is just a prototype for Terraform to give me an idea on how it connects.
// I'm considering Terraform instead of 'AWS SAM' which uses YAML + CLI because Terraform is multi-cloud and I think it would translate to better learning for my corporate environment.

provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "uploads" {
  bucket = "buybackbox-uploads-jm"
}

resource "aws_dynamodb_table" "items" {
  name           = "bbb_items"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "item_id"

  attribute {
    name = "item_id"
    type = "S"
  }
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_lambda_function" "logItem" {
  function_name = "logItem"
  runtime       = "nodejs22.x"
  handler       = "index.handler"
  filename      = "build/logItem.zip" # You'll need to zip your Lambda code locally

  role          = aws_iam_role.lambda_exec_role.arn

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.uploads.bucket
      ITEMS_TABLE = aws_dynamodb_table.items.name
    }
  }
}
