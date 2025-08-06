FROM node:22-alpine3.19

WORKDIR /app


#npm install 을 해도 상관없지만 npm ci를 하면 package-lock.json에 명시된 버전에 따라서 설치를 함
RUN mkdir -p /app
RUN npm ci

COPY . .