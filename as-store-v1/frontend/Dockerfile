# frontend/Dockerfile
# ------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json yarn.lock* ./
RUN npm ci
COPY . .
RUN npm run build          # `npm run build` creates `/app/dist`

# ------------------
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

