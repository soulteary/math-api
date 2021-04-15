FROM node:15.14.0

ARG NODE_ENV=production
ENV PORT=3000 NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
