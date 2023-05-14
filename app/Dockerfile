FROM node:19


ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

RUN mkdir -p /home/app
WORKDIR /home/app
COPY ./app /home/app

RUN npm install -g nodemon
      
CMD ["node","/home/app/server.js"]