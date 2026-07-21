terraform {
  required_version = ">=1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"

  default_tags {
    tags = {
      Project = "shortest-url"
      Managed = "Terraform"
    }
  }
}
