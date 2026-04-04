# Multi-stage Dockerfile for Covpages CLI runner
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

FROM node:22-alpine AS runner

RUN apk add --no-cache git ca-certificates bash

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY bin ./bin

RUN chmod +x bin/covpages.js bin/build-website.js && \
    ln -s /app/bin/covpages.js /usr/local/bin/covpages

WORKDIR /workspace
ENTRYPOINT ["node", "/app/bin/covpages.js"]
CMD ["--help"]
