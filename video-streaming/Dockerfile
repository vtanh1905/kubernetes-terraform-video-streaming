FROM node:16.18.0-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY ./assets ./assets

COPY ./src ./src

COPY tsconfig.json ./

RUN npm run build

CMD npm start
