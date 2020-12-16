## Get up and running with Docker

### For development

Create the development environment file under `editoria/config`.  
eg. `editoria/config/development.env`

Within your environment files, export the variables you want:

```sh
export EDITORIA_FLAVOUR=VANILLA
export PUBSWEET_SECRET=dev_secret
export POSTGRES_USER=editoria_user
export SERVES_CLIENT=false
export POSTGRES_PASSWORD=secretpassword
export POSTGRES_HOST=db
export POSTGRES_DB=editoria_dev
export POSTGRES_PORT=5432
export LANGUAGE_PROTOCOL=http
export LANGUAGE_HOST=language-tool
export LANGUAGE_PORT=8010
export MAILER_USER=<mailer user>
export MAILER_PASSWORD=<mailer password>
export MAILER_SENDER=<your preferred email account>
export MAILER_HOSTNAME=<mailer smtp server url>
export PASSWORD_RESET_PATH=password-reset
export NODE_ENV=development
export ADMIN_USERNAME=admin
export ADMIN_EMAIL=admin@example.com
export ADMIN_PASSWORD=adminadmin
export CLIENT_PROTOCOL=http
export CLIENT_HOST=0.0.0.0
export CLIENT_PORT=4000
export SERVER_PROTOCOL=http
export SERVER_HOST=server
export SERVER_PORT=3000
export S3_PROTOCOL=http
export S3_HOST=file_hosting
export S3_PORT=9000
export S3_ACCESS_KEY_ID_ADMIN=admin
export S3_SECRET_ACCESS_KEY_ADMIN=superSecretAdminPassword
export S3_ACCESS_KEY_ID_USER=editoria
export S3_SECRET_ACCESS_KEY_USER=superSecretUserPassword
export S3_BUCKET=uploads
export SERVICE_EPUB_CHECKER_CLIENT_ID=59a3392b-0c4f-4318-bbe2-f86eff6d3de4
export SERVICE_EPUB_CHECKER_SECRET=asldkjLKJLaslkdf897kjhKUJH
export SERVICE_EPUB_CHECKER_PROTOCOL=http
export SERVICE_EPUB_CHECKER_HOST=epubchecker
export SERVICE_EPUB_CHECKER_PORT=3001
export SERVICE_ICML_CLIENT_ID=59a3392b-0c4f-4318-bbe2-f86eff6d3de4
export SERVICE_ICML_SECRET=asldkjLKJLaslkdf897kjhKUJH
export SERVICE_ICML_PROTOCOL=http
export SERVICE_ICML_HOST=icml
export SERVICE_ICML_PORT=3002
export SERVICE_PAGEDJS_CLIENT_ID=59a3392b-0c4f-4318-bbe2-f86eff6d3de4
export SERVICE_PAGEDJS_SECRET=asldkjLKJLaslkdf897kjhKUJH
export SERVICE_PAGEDJS_PROTOCOL=http
export SERVICE_PAGEDJS_HOST=pagedjs
export SERVICE_PAGEDJS_PORT=3003
export SERVICE_XSWEET_CLIENT_ID=59a3392b-0c4f-4318-bbe2-f86eff6d3de4
export SERVICE_XSWEET_SECRET=asldkjLKJLaslkdf897kjhKUJH
export SERVICE_XSWEET_PROTOCOL=http
export SERVICE_XSWEET_HOST=xsweet
export SERVICE_XSWEET_PORT=3004
```

Import the environment variables into the current shell session:

```sh
source <your-env-file>
```

add the following lines in your etc/hosts file of your OS

```
127.0.0.1 file_hosting
127.0.0.1 pagedjs
```

On the root of the editoria folder run:

```
docker-compose up
```

After some time Editoria's client app will be available on `localhost:4000`

### For production

Create the production environment file under `editoria/config`.  
eg. `editoria/config/production.env`

Within your environment files, export the variables you want:

```sh
export EDITORIA_FLAVOUR=VANILLA (proper values are VANILLA or BOOKSPRINTS)
export PUBSWEET_SECRET=
export POSTGRES_USER=
export SERVES_CLIENT=true
export POSTGRES_PASSWORD=
export POSTGRES_HOST=
export POSTGRES_DB=
export POSTGRES_PORT=
export LANGUAGE_PROTOCOL= (acceptable values are http or https based on the url of the server where language tools is deployed)
export LANGUAGE_HOST=
export LANGUAGE_PORT=
export MAILER_USER=
export MAILER_PASSWORD=
export MAILER_SENDER=
export MAILER_HOSTNAME=
export PASSWORD_RESET_PATH=password-reset
export NODE_ENV=production
export SERVER_PROTOCOL= (acceptable values are http or https based on the url of the server)
export SERVER_HOST=
export SERVER_PORT=
export S3_PROTOCOL= (acceptable values are http or https based on the url of the server where minio is deployed)
export S3_HOST=
export S3_PORT=
export S3_ACCESS_KEY_ID_ADMIN=
export S3_SECRET_ACCESS_KEY_ADMIN=
export S3_ACCESS_KEY_ID_USER=
export S3_SECRET_ACCESS_KEY_USER=
export S3_BUCKET=
export SERVICE_EPUB_CHECKER_CLIENT_ID= (check service documentation on how to create client id and secret https://gitlab.coko.foundation/cokoapps/epub-checker)
export SERVICE_EPUB_CHECKER_SECRET=
export SERVICE_EPUB_CHECKER_PROTOCOL= (acceptable values are http or https based on the url of the server where epub-checker is deployed)
export SERVICE_EPUB_CHECKER_HOST=
export SERVICE_EPUB_CHECKER_PORT=
export SERVICE_ICML_CLIENT_ID= (check service documentation on how to create client id and secret https://gitlab.coko.foundation/cokoapps/icml)
export SERVICE_ICML_SECRET=
export SERVICE_ICML_PROTOCOL= (acceptable values are http or https based on the url of the server where icml is deployed)
export SERVICE_ICML_HOST=
export SERVICE_ICML_PORT=
export SERVICE_PAGEDJS_CLIENT_ID= (check service documentation on how to create client id and secret https://gitlab.coko.foundation/cokoapps/pagedjs)
export SERVICE_PAGEDJS_SECRET=
export SERVICE_PAGEDJS_PROTOCOL= (acceptable values are http or https based on the url of the server where pagedjs is deployed)
export SERVICE_PAGEDJS_HOST=
export SERVICE_PAGEDJS_PORT=
export SERVICE_XSWEET_CLIENT_ID= (check service documentation on how to create client id and secret https://gitlab.coko.foundation/cokoapps/xsweet)
export SERVICE_XSWEET_SECRET=
export SERVICE_XSWEET_PROTOCOL= (acceptable values are http or https based on the url of the server where xsweet is deployed)
export SERVICE_XSWEET_HOST=
export SERVICE_XSWEET_PORT=
```

Make sure that the application's DB is up and running as well as the services epub-checker, icml, pagedjs, xsweet, minio file server.

Import the environment variables into the current shell session:

```sh
source <your-env-file>
```

On the root of the editoria folder run:

```
docker-compose -f docker-compose.production.yml up
```

After some time Editoria's client app will be available on server url you have declared in your env file

## Get up and running without Docker

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

Installation instructions can be found:

- https://docs.docker.com/install/
- https://docs.docker.com/compose/install/

Prefer latest stable version of docker (18.x.x) and docker-compose (1.2x.x)

### Install Dependencies

Go to the root folder of your cloned Editoria and run `yarn`

Create environment files for each profile of the application under `editoria/config`.  
eg. `editoria/config/development.env`

Within your environment files, export the variables you want:

```sh
export EDITORIA_FLAVOUR='' (*) (proper values are VANILLA or BOOKSPRINTS)
export SERVES_CLIENT=true (*)
export PUBSWEET_SECRET='' (*) (**)
export POSTGRES_USER='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export POSTGRES_PASSWORD='' (*) (***) (by from both docker-compose.yml and pubsweet server)
export POSTGRES_HOST='' (-)
export POSTGRES_DB='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export POSTGRES_PORT='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export LANGUAGE_PROTOCOL='' (*)
export LANGUAGE_HOST='' (*)
export LANGUAGE_PORT='' (*)
export SERVER_PROTOCOL='' (*)
export SERVER_HOST='' (*)
export SERVER_PORT='' (*)
export MAILER_USER='' (*) (**)
export MAILER_PASSWORD='' (*) (**)
export MAILER_SENDER='' (*) (**)
export MAILER_HOSTNAME='' (*) (**)
export PASSWORD_RESET_PATH='' (*) (**)
export S3_PROTOCOL='' (*) (***)
export S3_HOST='' (*) (***)
export S3_PORT='' (*) (***)
export S3_ACCESS_KEY_ID_ADMIN='' (*) (***)
export S3_SECRET_ACCESS_KEY_ADMIN='' (*) (***)
export S3_ACCESS_KEY_ID_USER='' (*) (***)
export S3_SECRET_ACCESS_KEY_USER='' (*) (***)
export S3_BUCKET='' (*) (***)
export SERVICE_EPUB_CHECKER_CLIENT_ID='' (*)
export SERVICE_EPUB_CHECKER_SECRET='' (*)
export SERVICE_EPUB_CHECKER_PROTOCOL='' (*)
export SERVICE_EPUB_CHECKER_HOST='' (*)
export SERVICE_EPUB_CHECKER_PORT='' (*)
export SERVICE_ICML_CLIENT_ID='' (*)
export SERVICE_ICML_SECRET='' (*)
export SERVICE_ICML_PROTOCOL='' (*)
export SERVICE_ICML_HOST='' (*)
export SERVICE_ICML_PORT='' (*)
export SERVICE_PAGEDJS_CLIENT_ID='' (*)
export SERVICE_PAGEDJS_SECRET='' (*)
export SERVICE_PAGEDJS_PROTOCOL='' (*)
export SERVICE_PAGEDJS_HOST='' (*)
export SERVICE_PAGEDJS_PORT='' (*)
export SERVICE_XSWEET_CLIENT_ID='' (*)
export SERVICE_XSWEET_SECRET='' (*)
export SERVICE_XSWEET_PROTOCOL='' (*)
export SERVICE_XSWEET_HOST='' (*)
export SERVICE_XSWEET_PORT='' (*)
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
