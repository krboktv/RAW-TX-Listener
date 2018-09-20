FROM node:9

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3003
ENTRYPOINT ["node", "server.js"]
