FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json ./
# Avoid npm optional-deps bug with cross-platform lockfiles.
RUN npm install --prefer-offline --no-audit --include=optional

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
