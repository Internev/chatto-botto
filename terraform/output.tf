# Output the ECR repository URL
output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = aws_ecr_repository.chatto-botto.repository_url
}

# Output the nameservers for the hosted zone
output "nameservers" {
  value = aws_route53_zone.main.name_servers
}

output "certificate_status" {
  value = aws_acm_certificate.ssl_certificate.status
}

output "certificate_validation_status" {
  value = aws_acm_certificate_validation.ssl_certificate_validation.certificate_arn
}

output "target_group_arn" {
  value = aws_lb_target_group.app_tg.arn
}