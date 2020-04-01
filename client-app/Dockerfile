#Base image
FROM bsc-docker-all.artifactory.bsc.bscal.com/node:10 

#Create app directory
WORKDIR /usr/src/apps/client-app

ENV REACT_APP_API_URL=https://10.35.64.125/partnerengage-api/api

COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm config set registry https://artifactory.bsc.bscal.com/artifactory/api/npm/npm/

RUN npm install

COPY . .

RUN npm run build

RUN cd build && mkdir partnerengage &&  mv ./static ./partnerengage/ && mv ./favicon.ico ./manifest.json ./partnerengage/

RUN npm install express

CMD ["node", "web-server.js"]