# ECR Repository for Chatto-Botto
resource "aws_ecr_repository" "chatto-botto" {
  name = var.app_name
  image_scanning_configuration {
    scan_on_push = true
  }
  image_tag_mutability = "MUTABLE"
}
