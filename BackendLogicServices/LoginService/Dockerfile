FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY * ./
EXPOSE 3003
CMD ["npm", "run", "start-docker"]
