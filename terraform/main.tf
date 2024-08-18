# Main Terraform configuration for chatto-botto.com
#
# File structure:
# - networking.tf: VPC, subnets, security groups, internet gateway
# - load_balancer.tf: Application Load Balancer configuration
# - ecs.tf: ECS cluster, task definitions, services
# - ecr.tf: ECR repository
# - route53.tf: Route 53 configurations
# - variables.tf: Input variable declarations
# - outputs.tf: Output value declarations
# - providers.tf: AWS provider configuration
# - versions.tf: Terraform and provider version constraints
# - locals.tf: Local value declarations
# - data.tf: Data source declarations