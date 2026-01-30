# 🔗 Shortest URL Service

Terraform + ECS Fargate 기반으로 NestJS 서비스를 배포했습니다.

**URL단축 서비스**는 긴 URL을 짧은 URL로 변환하고, 접속 시 원본 URL로 리다이렉트하며  
방문 횟수(`visitCount`)를 추적합니다.

본 프로젝트는 기능 구현뿐 아니라  
**Port / Adapter 패턴을 적용한 아키텍처 설계와 도메인 분리** 에 중점을 두었습니다.

---

## 🧭 프로젝트 개요

- 긴 URL을 짧은 URL로 변환
- 단축 URL 접속 시 원본 URL로 리다이렉트
- 접속 횟수 자동 집계
- 도메인 중심 설계 + 인프라 의존성 최소화

> 개인 학습 프로젝트로,  
> **유지보수성과 확장성을 고려한 백엔드 구조 설계**를 목표로 개발했습니다.

---

## 🛠 기술 스택

### Infrastructure

- **Terraform**
- **AWS**

### Backend

- **Node.js**
- **NestJS**
- **TypeScript**

### Database

- **MongoDB**
- **Mongoose ODM**

### Architecture

- **Port / Adapter 패턴 (Hexagonal Architecture)**
- **Domain 중심 설계**
- **Repository Pattern**
- **Entity ↔ Domain Mapper**

### Etc

- **RESTful API**
- **Git / GitHub**

---

## ⛏️ 인프라 아키텍처

```
Client
  │
  ▼
Application Load Balancer (Http: 80)
  │
  ▼
Ecs Service (Fargate)
  │
  ▼
NestJS Container (:8000)

```

- Terraform을 사용하여 AWS를 IaC하였으며, NestJS는 ECS Fargate기반 컨테이너 환경에서 실행됩니다.

---

### Why ECS Fargate?

- EC2 인스턴스 직접 생성 및 운영 불필요
- CPU / Memory 단위 리소스 설정
- 컨테이너 단위 과금
- Auto Scaling 연동 가능

---

### Terraform 구성

```
terraform/
 ├── provider.tf    # AWS Provider
 ├── vpc.tf         # VPC / Subnet / IGW
 ├── alb.tf         # Application Load Balancer
 ├── ecs.tf         # ECS Cluster / Task / Service (Fargate)
 ├── iam.tf         # ECS Task Execution Role
 └── outputs.tf     # ALB DNS 출력
```

- 기능 단위 파일 분리

---

### ECS Task Definition

```hcl
requires_compatibilities = ["FARGATE"]
network_mode = "awsvpc"
cpu          = "256"
memory       = "512"
```

- NestJS는 Docker 이미지 기반으로 실행
- ALB를 통해 외부 트래픽을 수신

---

## 🏗 시스템 아키텍처

```
Client
  │
  ▼
Controller (API Layer)
  │
  ▼
Application Service
  │
  ▼
Port (Interface)
  │
  ▼
Repository Adapter ◀───▶ Entity ◀─▶ Domain Mapper
  │
  ▼
MongoDB
```

### 설계 포인트

- Service 계층은 DB 구현체를 알지 않음
- Port를 통해 의존성 역전(DIP) 적용
- Repository Adapter 교체 가능
- Domain 로직이 Mongoose에 의존하지 않도록 분리

---

## 🗄 ERD

SHORTEST_URL

_id &emsp; ObjectId(PK)   
key &emsp; string(unique)   
originalUrl &emsp; string  
visitCount &emsp; number  
createdAt &emsp; Date  
updatedAt &emsp; Date

### 컬럼 설명

- **key**: 단축 URL 식별자 (Unique)
- **originalUrl**: 리다이렉트 대상 URL
- **visitCount**: 접근 횟수 (MongoDB `$inc` 사용)
- **timestamps**: 생성 / 수정 시간 자동 관리

---

## 🔗 API 명세

### 1️⃣ 단축 URL 생성

**POST** `/shortest-url`

```json
{
  "originalUrl": "https://sample.com"
}
```

**Response**

```json
{
  "key": "a1b2c",
  "originalUrl": "https://sample.com",
  "shortUrl": "https://a1b2c"
}
```

---

### 2️⃣ 단축 URL 접속

**GET /:key**

- 원본 URL 조회
- visitCount 증가
- 301 Redirect

---

### 3️⃣ 단축 URL 목록 조회

**GET /shortest-url?page=&size=**

```json
[
  {
    "key": "a1b2c",
    "originalUrl": "https://sample.com",
    "visitCount": 12
  }
]
```

---

## ⭐ 핵심 기능

- URL 단축 생성
- Key 기반 조회
- 원본 URL 리다이렉트
- 방문 수 추적 (visitCount)
- 페이징 기반 목록 조회
- Entity ↔ Domain 변환 구조
- Port / Adapter 기반 Repository 분리

---

## 📂 프로젝트 구조

```
src/
├─ domain/
│ └─ shortest-url.ts
├─ port/
│ └─ out/
│ ├─ load-shortest-url.port.ts
│ └─ create-shortest-url.port.ts
├─ adapter/
│ ├─ shortest-url.repository.ts
│ ├─ shortest-url.entity.ts
│ └─ shortest-url.mapper.ts
└─ ...
```

**구조 설명**

- Domain: 비즈니스 규칙
- Port: 외부 의존성 추상화
- Adapter: MongoDB/Mongoose 접근 책임

---

## 🧩 확장 계획

- 사용자 인증 기반 URL 관리
- Redis 캐싱 도입
- 클릭 통계 및 대시보드
- 이벤트 기반처리(Kafka 등) 확장기능 추가

---

## ✍️ Summary

NestJS 기반 URL단축 서비스를 구현하는 것을 넘어, Terraform을 활용한 IaC 구성과 ECS Fargate 기반 컨테이너 배포 환경을 구출하며 실제 운영 환경을 가정한 백엔드 서비스 아키텍처를
설계했습니다.
도메인 중심 설계와 Port/Adapter 패턴을 통해 인프라 및 데이터 계층과의 결합도를 낮추었고, 컨테이너 기반 배포 구조를 적용하여 확장성과 유지보수성을 고려한 시스템을 구현했습니다.
이를 통해 단순 기능 구현이 아닌, **서비스 관점에서의 백엔드 설계와 DevOps 기본 역량을 함께 검증하는 프로젝트**를 목표로 했습니다.
