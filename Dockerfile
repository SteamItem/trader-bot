FROM node:12-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package*.json /usr/src/app/
RUN npm ci
COPY ./ /usr/src/app
RUN npm run tsc
EXPOSE 80
CMD [ "npm", "start" ]