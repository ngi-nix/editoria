## Get up and running with Docker
### Docker
* The platform requires `docker` version from `19.03.13` up to `20.10.3` and `docker-compose` `1.27.4` (`1.28.x` should be avoided due to this issue https://github.com/docker/compose/issues/8046)  
* Installing docker https://docs.docker.com/engine/install  
* Docker without sudo https://docs.docker.com/engine/install/linux-postinstall/  
* Installing docker-compose https://docs.docker.com/compose/install/  

### For development

Create the development environment file under `editoria/config`.  
eg. `editoria/config/development.env`

Within your environment files, export the variables you want:

```sh
export MAILER_USER=<mailer user>
export MAILER_PASSWORD=<mailer password>
export MAILER_SENDER=<your preferred email account>
export MAILER_HOSTNAME=<mailer smtp server url>
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
