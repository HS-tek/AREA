FROM node:16-alpine

RUN mkdir -p /src

WORKDIR /src

RUN ls -l
ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install
RUN rm -f /src/node_modules
RUN cp -a /tmp/node_modules /tmp/yarn.lock /tmp/package.json /src/
RUN ls /src

USER node

CMD ["yarn", "run", "dev"]