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

variable "domain_name" {
  description = "The domain name for the application"
  type        = string
  default     = "chatto-botto.com"
}

variable "blog_nameservers" {
  description = "The nameservers for the blog subdomain"
  type        = list(string)
  default     = ["ns1.clickhost.com.au", "ns2.clickhost.com.au"]
}