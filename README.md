# 🔗 Shortest URL Service

NestJS와 MongoDB 기반의 **URL 단축 서비스** 입니다.  
긴 URL을 짧은 URL로 변환하고, 접속 시 원본 URL로 리다이렉트하며  
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

## 🚀 실행 방법

```shell
npm install
npm run start:dev
```

> **MongoDB는 외부 인스턴스(AWS)를 사용합니다.**

---

## 🧩 확장 계획

- 사용자 인증 기반 URL 관리
- Redis 캐싱 도입
- 클릭 통계 및 대시보드
- 이벤트 기반처리(Kafka 등) 확장기능 추가

---

## ✍️ 회고

ShortestURL 프로젝트를 통해 **"작은 서비스라도 구조가 곧 품질이다"** 라는 것을 체감하고
도메인 중심 설계와 Port/Adapter 패턴을 적용하면서 기능 추가 보다 유지보수성과 확장성을 먼저 고민하는 개발습관을 기를 수 있었다.
