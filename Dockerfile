FROM node:12.16.3-alpine3.9

WORKDIR /app

RUN apk update
RUN apk upgrade
RUN apk add git python make g++ bash

ADD ./package.json /app/package.json
ADD ./yarn.lock /app/yarn.lock

RUN yarn install

ADD . /app

# Run an empty command by default - to keep container running
CMD tail -f /dev/null
