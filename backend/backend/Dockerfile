FROM node:21.7.3-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=4096" yarn build

EXPOSE 9000

CMD ["yarn", "start"]
