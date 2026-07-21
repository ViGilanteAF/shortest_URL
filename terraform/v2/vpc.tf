module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  version = "~> 5.8"

  name = "shortest-url"

  cidr = var.vpc_cidr

  azs = [
    "ap-northeast-2a",
    "ap-northeast-2c"
  ]
  public_subnets = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  private_subnets = [
    "10.0.11.0/24",
    "10.0.12.0/24"
  ]

  enable_nat_gatway    = true
  single_nat_gatway    = true
  enable_dns_hostnames = true
  enable_dns_support   = true
}
