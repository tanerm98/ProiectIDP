FROM node:14
WORKDIR /usr/src/app
<<<<<<< HEAD
COPY ./package*.json ./
RUN npm ci
COPY ./* ./
=======
COPY package*.json ./
RUN npm ci
COPY * ./
>>>>>>> bf01204004941e8513fbabba7c8cd87b9028e16d
EXPOSE 3002
CMD ["npm", "run", "start-docker"]
