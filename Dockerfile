FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY node_modules ./node_modules
COPY build ./build

EXPOSE 3000

CMD ["node", "./build/index.js"]
