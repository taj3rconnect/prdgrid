# prd-demo — prdgrid demo site (static demo + SQLite-backed seed API)
# Build:  docker build -t prd-demo .
# Run:    docker run -d --name prd-demo --restart unless-stopped -p 8058:8058 -v prd-demo-data:/data prd-demo

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx vite build --config vite.demo.config.ts

FROM node:22-bookworm-slim
ENV NODE_ENV=production \
    PORT=8058 \
    DB_PATH=/data/prdgrid.db \
    STATIC_DIR=/app/docs
WORKDIR /app/demo-server
COPY demo-server/package.json ./
RUN npm install --omit=dev
COPY demo-server/ ./
COPY demo/sampleData.ts /app/demo/sampleData.ts
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/docs /app/docs
EXPOSE 8058
VOLUME /data
CMD ["npx", "tsx", "server.ts"]
