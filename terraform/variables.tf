variable "app_name" {
  default = "shortest-url"
}
variable "container_image" {
  description = "ECR image URI"
}
variable "container_port" {
  default = 8000
}
