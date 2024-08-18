# VPC Networking

resource "aws_vpc" "app_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "${var.app_name}-vpc"
  }

  enable_dns_hostnames = true
  enable_dns_support   = true
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "app_subnets" {
  count                   = 2
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-subnet-${count.index + 1}"
  }
}

resource "aws_security_group" "app_sg" {
  name        = "${var.app_name}-sg"
  description = "Allow inbound traffic for Next.js app"
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Internet gateway

resource "aws_internet_gateway" "app_igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = "${var.app_name}-igw"
  }
}

resource "aws_route_table" "app_route_table" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.app_igw.id
  }

  tags = {
    Name = "${var.app_name}-rt"
  }
}

resource "aws_route_table_association" "app_route_table_association" {
  count          = 2
  subnet_id      = aws_subnet.app_subnets[count.index].id
  route_table_id = aws_route_table.app_route_table.id
}