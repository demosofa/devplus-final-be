# 1. Build
FROM node:16.18.0-alpine

WORKDIR /app
#
COPY package.json /app/
COPY yarn.lock /app/

RUN npm install

RUN apk update && apk upgrade && apk add --no-cache bash git

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]
