## Get up and running

Make sure you use an LTS version of node `node = 12.16.1`.

### nvm

To determine which version of Node you are running type `node -v`.
If the version is not 12.16.1 you will need to use nvm to prescribe a specific node version. Installation of nvm is covered here https://github.com/creationix/nvm#installation

Once nvm is installed use the command `nvm install 12`

For further information on how to use nvm see https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/

### Install yarn

```sh
npm install -g yarn
```

You should also have `yarn 1.19.1` or higher installed (out-of-date versions may cause installation errors).

### Install Docker and docker-compose

Instalation instructions can be found:

- https://docs.docker.com/install/
- https://docs.docker.com/compose/install/

Prefer latest stable version of docker (18.x.x) and docker-compose (1.2x.x)

### Install Dependencies

Go to the root folder of your cloned Editoria and run `yarn`

Create environment files for each profile of the application under `editoria-vanilla/config`.  
eg. `editoria-vanilla/config/development.env`

Within your environment files, export the variables you want:

```sh
export EDITORIA_FLAVOUR='' (*) (proper values are VANILLA or BOOKSPRINTS)
export PUBSWEET_SECRET='' (*) (**)
export POSTGRES_USER='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export POSTGRES_PASSWORD='' (*) (***) (by from both docker-compose.yml and pubsweet server)
export POSTGRES_HOST='' (-)
export POSTGRES_DB='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export POSTGRES_PORT='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export LANGUAGE_PORT='8090'
export LANGUAGE_ENDPOINT='http://localhost'
export SERVER_PORT='' (**)
export MAILER_USER='' (*) (**)
export MAILER_PASSWORD='' (*) (**)
export MAILER_SENDER='' (*) (**)
export MAILER_HOSTNAME='' (*) (**)
export PASSWORD_RESET_URL='' (*) (**)
export PASSWORD_RESET_SENDER='' (*) (**)
export S3_ENDPOINT='' (*) (***)
export S3_PORT='' (*) (***)
export S3_ACCESS_KEY_ID_ADMIN='' (*) (***)
export S3_SECRET_ACCESS_KEY_ADMIN='' (*) (***)
export S3_ACCESS_KEY_ID_USER='' (*) (***)
export S3_SECRET_ACCESS_KEY_USER='' (*) (***)
export S3_BUCKET='' (*) (***)
export NODE_ENV='' (**)
```

(\*)Required for the application to be functional

(-) Optional

(\*\*) This key-value pairs could be either declared as env variables or either in the corresponding config file e.g. `local-development.json`, `development.json`, etc

(\*\*\*) These fields should by any means exist in the env source file for the correct initialization of the docker container which holds the database of the application

Import the environment variables into the current shell session:

```sh
source <your-env-file>
```

Get the database docker container up and running:

```sh
yarn start:postgres
```

Open a new terminal session and source again your environment file. Create a new database for the app by running `yarn setupdb` and follow the CLI to create also the admin user (this will happen once upon your first configuration of the app)

Get the object store server up and running:

```sh
yarn start:file-server
```

Create the app's objects' bucket for being able to upload files and create templates (should run only once upon the initialization of the application):

```sh
yarn create:file-bucket
```

When your db is ready you can start the server:
`yarn server`

When the server boots successfully open a new terminal session, source again your environment file and run `yarn start:services` which will initialize and start all the additional required Editoria's services.

At this point you are good to go and use the app

If for some reason want to reset your app's db you could run:

```sh
yarn resetdb
```

If you want to clean your docker cache and containers e.g. changes occur in either env variables, docker-compose.yml, development.env, production.env, etc.:

```sh
docker-compose down
docker-compose rm -fv
rm -rf database
```

The above action will require you to run `yarn setupdb` again and also ALL YOUR DATA WILL BE LOST

IT IS REALLY IMPORTANT TO MAKE SURE THAT YOUR ENV FILE IS SOURCED BEFORE RUNNING ANY OF THE FOLLOWING:
`yarn start:postgres`
`yarn start:services`
`yarn setupdb`
`yarn server`
