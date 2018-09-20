FROM node:9

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3002
ENTRYPOINT ["node", "server.js"]