resource "aws_iam_role" "ecs_task_executino" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statment = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}
resource "aws_iam_role_policy_attachment" "ecs_polocy" {
  role       = aws_iam_role.ecs_task_executino.name
  policy_arn = "arn:aws:iam: :aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
