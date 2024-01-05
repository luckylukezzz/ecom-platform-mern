FROM node:17-alpine

RUN npm install -g nodemon

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm","run","dev"]