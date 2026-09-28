FROM node:24.21.0-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
  && apt-get install --no-install-recommends --yes python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm exec -- react-router build && npm prune --omit=dev

FROM node:24.21.0-bookworm-slim AS runtime

WORKDIR /app

ENV DATABASE_PATH=/data/db.sqlite
ENV NODE_ENV=production
ENV PORT=3027

COPY --from=build /app/app ./app
COPY --from=build /app/build ./build
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/server ./server

RUN mkdir /data && chown node:node /data

USER node
EXPOSE 3027

CMD ["node_modules/.bin/tsx", "server/index.ts"]
