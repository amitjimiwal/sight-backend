
ARG NODE_VERSION=18.18.2
FROM node:${NODE_VERSION}-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["npm","run","dev"];