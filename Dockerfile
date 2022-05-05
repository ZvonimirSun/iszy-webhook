FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --registry=https://registry.npmmirror.com

COPY . .

CMD ["node", "./build/index.js"]

EXPOSE 3000