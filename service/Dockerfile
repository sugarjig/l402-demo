FROM node:18.18.2

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY app.js .

CMD ["npm", "run", "start"]