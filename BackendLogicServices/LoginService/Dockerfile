FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY * ./
EXPOSE 3004 5432
CMD ["npm", "run", "start-docker"]
