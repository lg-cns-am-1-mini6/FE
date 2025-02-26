# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the build with nginx and custom config
FROM nginx:stable-alpine
# 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html
# 사용자 정의 nginx 설정 파일 복사 (컨테이너 내 default 설정으로 덮어씌움)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
