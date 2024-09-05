# Configure the AWS Provider
provider "aws" {
  region = "ap-southeast-2"  # or your preferred region
}

# Create a DynamoDB table
resource "aws_dynamodb_table" "conversations_table" {
  name           = "Conversations"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1

  hash_key  = "PK"
  range_key = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  global_secondary_index {
    name               = "GSI1"
    hash_key           = "GSI1PK"
    range_key          = "GSI1SK"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "ALL"
  }

  tags = {
    Environment = "production"
    Project     = "chatto-botto"
  }
}

# Output the table name
output "table_name" {
  value = aws_dynamodb_table.conversations_table.name
}

# Output the table ARN
output "table_arn" {
  value = aws_dynamodb_table.conversations_table.arn
}