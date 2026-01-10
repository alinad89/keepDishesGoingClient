FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json ./
# Avoid npm optional-deps bug with cross-platform lockfiles.
RUN npm install --prefer-offline --no-audit --include=optional

COPY . .

# Add these lines BEFORE npm run build
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_USE_MOCK_API
ARG VITE_MOCK_API_URL
ARG VITE_API_URL

# Vite will automatically pick up these as environment variables
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
ENV VITE_USE_MOCK_API=$VITE_USE_MOCK_API
ENV VITE_MOCK_API_URL=$VITE_MOCK_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80