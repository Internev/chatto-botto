# Create a Route 53 hosted zone for your domain
resource "aws_route53_zone" "main" {
  name = var.domain_name # You'll need to define this variable
}

# Create an A record that points to your Application Load Balancer
resource "aws_route53_record" "app" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name # This will create a record for the root domain
  type    = "A"

  alias {
    name                   = aws_lb.app_lb.dns_name
    zone_id                = aws_lb.app_lb.zone_id
    evaluate_target_health = true
  }
}

# Create a CNAME record for the www subdomain
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = "300"
  records = [var.domain_name]
}

# Create an NS record for the blog subdomain
resource "aws_route53_record" "blog_subdomain" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "blog.${var.domain_name}"
  type    = "NS"
  ttl     = "300"
  records = var.blog_nameservers
}
