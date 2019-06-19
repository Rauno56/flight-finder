FROM node:12-alpine

LABEL maintainer "Rauno Viskus"
WORKDIR /app/
EXPOSE 3000
CMD npm run start

COPY package.json package-lock.json ./
RUN npm ci
RUN npm prune --production

COPY . ./
