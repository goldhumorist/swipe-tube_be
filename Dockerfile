FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY ./src ./src
COPY ./tsconfig.json .
COPY ./migrations ./migrations
COPY ./config ./config
COPY ./.env .
COPY ./.sequelizerc .

RUN npm run build

USER node

EXPOSE 8080

CMD [ "npm", "start" ]