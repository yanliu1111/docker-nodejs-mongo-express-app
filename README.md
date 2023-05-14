## nodejs-mongo-app developing with Docker

Docker learning project from [**TechWorld with Nana**](https://www.youtube.com/watch?v=3c-iBn73dDE&t=7126s&ab_channel=TechWorldwithNana)
with many modifications and improvements inside, hope it helful for you.💖

💛 For this project, eventually you only need to operate:

```bash
docker-compose -f mongo.yaml up

or

docker-compose -f mongo.yaml up -d --build

docker-compose -f mongo.yaml down
```

## 🚀Let's start! This demo app shows a simple user profile app set up using

- index.html with pure js and css styles
- nodejs backend with express module
- mongodb for data storage

All components are docker-based

### With Docker

#### To start the application

Step 1: Create docker network

    docker network create mongo-network

Step 2: start mongodb

    docker run -d -p 27016:27017 -e MONGO_INITDB_ROOT_USERNAME=username -e MONGO_INITDB_ROOT_PASSWORD=userpassword --name mongodb --net mongo-network mongo

Step 3: start mongo-express

    docker run -d -p 8081:8081 -e ME_CONFIG_MONGODB_ADMINUSERNAME=username -e ME_CONFIG_MONGODB_ADMINPASSWORD=userpassword --net mongo-network --name mongo-express -e ME_CONFIG_MONGODB_SERVER=mongodb mongo-express

_NOTE: creating docker-network in optional. You can start both containers in a default network. In this case, just emit `--net` flag in `docker run` command_

**Get the warning:** (node:7) [MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

Step 4: open mongo-express from browser<br>
**why http://0.0.0.0:8081/ not work?**<br>
http://localhost:8081 works

Step 5: create `user-account` _db_ and `users` _collection_ in mongo-express

Step 6: Start your nodejs application locally - go to `app` directory of project

    npm install
    node server.js

Step 7: Access you nodejs application UI from browser

    http://localhost:3000

### With Docker Compose

#### To start the application

Step 1: start mongodb and mongo-express

    docker-compose -f mongo.yaml up

_You can access the mongo-express under localhost:8080 from your browser_

Step 2: in mongo-express UI - create a new database "my-db"

Step 3: in mongo-express UI - create a new collection "users" in the database "my-db"

Step 4: start node server

    npm install
    node server.js

Step 5: access the nodejs application from browser

    http://localhost:3000

#### To build a docker image by Jenkins

    docker build -t my-app:1.0 .

The dot "." at the end of the command denotes location of the Dockerfile.

#### To push the image to Docker Repository

1. either people can take it, such as tester, maybe want to download the image
2. or development server can actually pull it from their.

> Start "my-app" container to verify:
> app starts successfully
> app environment is configured correctly

## 3 volume types

1 docker run

```bash
 -v /home/mount/data:/var/lib/mysql/data
```

Host Volumes

- you decide where on the host file system the reference is made, so which folder on the host file system you want to mount into the container

2 docker run
when you create a volume, just by referencing the **container** directory, so dont specify which directory on the host should be mounted. But that is taking care of the docker itself.

```bash
-v /var/lib/mysql/data
```

`Anonymonus Volumes`

- for each container a folder is generated that gets mounted, you don't have a reference to this automatically generted folder on the host file system

3 docker run

improve of the anonymous volume and it specifies the name of that folder on the host file system, and the name is up to you. It just to reference the directory and this type we called `Named Volumes`

```bash
 -v name:/var/lib/mysql/data
```

- compare to anonymous volume, you can reference the volume by name so you dont have to know exactly the path.

Summary: from these three, the mostly used one and the one you should be **using in the production**, is the `Named Volumes`. Because there are additional benefits to letting docker actually manage those volumes directories on the host.

## 4 Same as docker run commands, volume in docker-compose

- Named Volume

```bash
version: "3"
services:
  mongodb:
    image: mongo
    ports:
      - 27017:27017
    volumes:
      - db_data:/var/lib/mysql/data
  mongo-express:
    image: mongo-express
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: username
      ME_CONFIG_MONGODB_ADMINPASSWORD: userpassword
      ME_CONFIG_MONGODB_SERVER: mongodb
    depends_on:
      - mongodb
volumes:
    db_data
```

you define at least the volumes that you want to mount into the containers. The benefit of this you can actually mount a reference of the same folder on the host to more than one containers. That would be beneficial if those containers need to share data.
