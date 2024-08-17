variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "ap-southeast-2"
}

variable "app_name" {
  description = "The name of the app"
  type        = string
  default     = "chatto-botto"
}

variable "app_port" {
  default = 3000
}