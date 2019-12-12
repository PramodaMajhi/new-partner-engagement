#Base image
FROM bsc-docker-all.artifactory.bsc.bscal.com/node:10 

#Create app directory
WORKDIR /usr/src/apps/server-api

COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm config set registry https://artifactory.bsc.bscal.com/artifactory/api/npm/npm/

RUN npm install

COPY . .

CMD ["npm", "start"]