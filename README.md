# Editoria  

This is the Editoria monorepo.  

It consists of the main Editoria application, as well as the different [Pubsweet](https://gitlab.coko.foundation/pubsweet) components and helper libraries that the app is made of.  

This application is being developed by the [Coko Foundation](https://coko.foundation/), for the [University of California Press](http://www.ucpress.edu/).  
For more information, visit the project's [website](https://editoria.pub/) or our [chat channel](https://mattermost.coko.foundation/coko/channels/editoria).  
For the editor that Editoria uses, see its related project [Wax](https://gitlab.coko.foundation/wax/wax).  

## Community Roadmap # 1
The current features on our list are the following:

| PROJECT       | DESCRIPTION                                                               | ISSUE # | IN PROGRESS | DONE |
|---------------|---------------------------------------------------------------------------|---------|-------------|------|
| EDITORIA      | Editoria Upgrade                                                          | #233      |            |  ✔    |
| WAX           | Wax Upgrade                                                               | #234        |            |✔      |
| WAX           | Color code tracked changes by user                                        | #164    |             |      |
| EDITORIA      | Configure book builder to omit blue buttons                               | #172    |     ✔        |      |
| EDITORIA      | Indenting chapters in book builder                                        | #171    |      ✔      |      |
| EDITORIA      | Error message when uploading incorrect file format                        | #189    |             | ✔     |
| WAX           | Author Style                                                              | #191    |             |  ✔   |
| WAX           | Provide a larger text box for inputting figure captions                   | #216    |             |  ✔   |
| EDITORIA      | enable "read only" chapter mode                                           | #170    |             |      |
| EDITORIA      | Autocomplete for adding book team roles                                   | #186    |             | ✔     |
| EDITORIA      | Always show chapter name                                                  | #193    |     ✔        |      |
| EDITORIA      | Book-level (and perhaps chapter-level) metadata                           | #210    |             |      |
| EDITORIA      | Configurable archive options for completed / abandoned books              | #226    |             |      |
| WAX           | Toolbar button to change case                                             | #203    |             |   ✔  |
| PUBSWEET CORE | Usernames allowed with special characters                                 | #195    |             |   ✔   |
| PUBSWEET CORE | Ask for first name and surname on sign up                                 | #197    |             |      |
| XSWEET        | Kill automatic numbering in numbered list style                           | #198    |             |      |
| EDITORIA      | Allow components to move from body to front- or backmatter and vice versa | #214    |             |      |
| EDITORIA      | Add more information to the “Books” dashboard and make it sortable        | #215    |             |      |


## Get up and running  

Get your copy of the repository.  
```sh
git clone https://gitlab.coko.foundation/editoria/editoria.git
cd editoria
```

Make sure you use you use `node >= 8.3`.

### nvm
To determine which version of Node you are running type `node -v`.
If the version is not 8.3 or greater you will need to use nvm to prescribe a specific node version. Installation of nvm is covered here https://github.com/creationix/nvm#installation

Once nvm is installed use the command `nvm install 8.3`

For further information on how to use nvm see https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/

### Install yarn
```sh
npm install -g yarn
```

You should also have `yarn 1.3.2` or higher installed (out-of-date versions may cause installation errors).

### Install Docker and docker-compose
Instalation instructions can be found:
* https://docs.docker.com/install/
* https://docs.docker.com/compose/install/

Prefer latest stable version of docker (18.x.x) and docker-compose (1.2x.x)

### Install Dependencies
Install all dependencies and navigate to the editoria app folder.  
```sh
yarn
cd packages/editoria-app
```

Create a `config/local-development.json` file.  
Edit that to enter your database secret as well as placeholders for INK credentials [INK](https://gitlab.coko.foundation/INK/ink-api).  
In this file, add the following:  
```json
{
    "pubsweet-server": {
        "secret": "<your-secret-here>"
    },
    "pubsweet-component-ink-backend": {
        "inkEndpoint": "< your-ink-api-endpoint >",
        "email": "< your-ink-email >",
        "password": "< your-ink-password >",
        "recipes": {
            "editoria-typescript": "< editoria-typescript-recipe-id >"
        }
    }
}
```
INK credentials are optional, you don't need them to run Editoria, you will just not be able to upload Word (docx) files.

If you do wish to use INK we recommend using a demo instance of INK hosted by Coko in your initial Editoria setup. Please contact the team on https://mattermost.coko.foundation/coko/channels/editoria in order to get the required credentials and information.

If you want to run your own instance of [INK](https://gitlab.coko.foundation/INK/ink-api), be sure that:
* the `<your-ink-api-endpoint>` in `local-development.json` ends with a trailing slash
* if INK is running as a service on a port, ensure it is on port `3000`
* If INK and Editoria are on the same server, Editoria should be set to run on another port than `3000`, AND the `postgres` docker component for INK should run on a different port (`4321` instead of `5432`for instance).

Again, if you need to test editoria, asking for the credentials will be the fastest way to be set up.

Create environment files for each profile of the application under `editoria-app/config`.  
eg. `editoria-app/config/development.env`

Within your environment files, export the variables you want:
```sh
export PUBSWEET_SECRET='' (*) (**)
export POSTGRES_USER='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export POSTGRES_PASSWORD='' (*) (***) (by from both docker-compose.yml and pubsweet server)
export POSTGRES_HOST='' (-)
export POSTGRES_DB='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export POSTGRES_PORT='' (*) (***) (used by both docker-compose.yml and pubsweet server)
export SERVER_PORT='' (**)
export INK_ENDPOINT='' (*) (**)
export INK_USERNAME='' (*) (**)
export INK_PASSWORD='' (*) (**)
export INK_EDITORIA_TYPESCRIPT='' (*) (**)
export MAILER_USER='' (*) (**)
export MAILER_PASSWORD='' (*) (**)
export MAILER_SENDER='' (*) (**)
export MAILER_HOSTNAME='' (*) (**)
export PASSWORD_RESET_URL='' (*) (**)
export PASSWORD_RESET_SENDER='' (*) (**)
export NODE_ENV='' (**)
```
(*)Required for the application to be functional

(-) Optional

(**) This key-value pairs could be either declared as env variables or either in the corresponding config file e.g. `local-development.json`, `development.json`, etc

(***) These fields should by any means exist in the env source file for the correct initialization of the docker container which holds the database of the application

Import the environment variables into the current shell session:
```sh
source <your-env-file>
```

Get the database docker container up and running:  
```sh
yarn start:services
```

Create a database and enter credentials for an admin user account (a postgres db should already be up and running):
```sh
yarn resetdb
```

Follow the prompts to enter user credentials and complete the database setup.

_**Note**: If you want to use a non-default database, see [Pubsweet development setup](https://gitlab.coko.foundation/pubsweet/pubsweet/wikis/Development:%20setup#setup-2)._


You're good to go. Open a separate terminal in the same folder and run the app with:  
```sh
yarn server
```

Clean your docker cache and containers before the first time you run the application (under editoria-app) or if changes occur in either env variables, docker-compose.yml, local-development, local-production, etc.:
```sh
docker-compose down
docker-compose rm -fv
rm -rf data
```

## Developer info

see also the [Pubsweet wiki](https://gitlab.coko.foundation/pubsweet/pubsweet/wikis/home) for developer notes.

## FAQ
### I'm getting user errors running `yarn start:services` or `yarn server`

It's crucial to use the same user when installing Editoria and running the Editoria database services. These commands are:
* Running `yarn` from Editoria's root directory. This installs Editoria and its dependencies
* Running `yarn start:server` for the first time sets up a database to use with Editoria. This configures a database that expects that the same user that is running this command has also run `yarn` from Editoria's root directory.

If you see user errors running `yarn start:services` or `yarn server`, your best bet is to clear the existing data and start the install anew, as the same user.

First, delete all the Docker data:
```
docker-compose down
docker-compose rm -fv
rm -rf data
```

Then, follow the steps for a clean install.

### When running `yarn start:services`, I get a `Bind for 0.0.0.0:5432 failed: port is already allocated` error

Something (probably postgres) is already running on the port that the Docker database services try to use (5432). Solution for Ubuntu:
1. `lsof -i tcp:5432`: lists the processes running on port 5432
2. `kill -9 {PID}`: kills (gracelessly) the process. Get the PID from the output of the above step.

This should free up the port so the Docker database services can run on it.

### I've made changes on my `<profile>.env` file, how can these changes be applied?

To be sure that your changes in `<profile>.env` are registered, you need to reset your docker containers and source `<your-env-file>`. To do so, you can follow these steps:

* Kill any running instances of Editoria app

* On editoria-app root folder perform:

```
docker-compose down
docker-compose rm -fv
```


  `docker-compose down` will unmount the docker container

  `docker-compose rm -fv` will remove the container and it's anonymous volumes.   

  `rm -rf data` will delete the content from your database

* Now you could run `source <your-env-file>` and start again the services and server

### Which are the absolute required key-value pairs for an env file?

* POSTGRES_USER
* POSTGRES_PASSWORD
* POSTGRES_DB
* POSTGRES_PORT

These values are needed in order the docker container which hosts the PostrgesDB of the application to be initialised correctly.

### I am facing issues when trying to boot-up the application which are related to INK API

Ink is the process manager developped by Coko. Editoria uses Ink mainly to convert Microsoft Word .docx into proper HTML to be used in Editoria (among other things).
Since it has been one of the requirements from the begginning, running Editoria means that you need to have access to an instance of INK before runnning it, thus the appropriate configuration should be in place in order for Editoria to start properly.

INK's configuration could either be placed in:
* `local.development.json`
* `development.json`
* `<profile>.env`

Please contact the team on https://mattermost.coko.foundation/coko/channels/editoria in order to get the required credentials

### How can I access the epub file?

EPUB files are created and stored in the `uploads` directory (`editoria/packages/editoria-app/uploads`) every time the book is exported with the "EXPORT BOOK" button on the top right of the book. Be sure to sort by created date to ensure you're getting the most recent file.

### Does the HTML out of Editoria support accessibility including the use of Alt tags?
We are working with Benetech to fully understand and plan for accessibility. This development is on our development roadmap.

### Does Editoria support multiple languages?
Yes. Editoria supports any language supported by the user’s browser. Editoria also supports special characters. This said, language support is an area that needs thorough testing for the many edge cases and rare cases that exist. This is an ideal opportunity for a community member to show leadership and help organize and optimize.

### Does Editoria include an asset manager for images and multimedia files that may need to be inserted into text?
This is on our development roadmap.

### Can Editoria integrate with other tools and services?
Yes. Editoria’s architecture is all API-orientated and can be easily extended for third party service integration. For more information, visit https://editoria.pub
  
### Can notes be moved to backmatter (rather than footnotes)?
At this moment no, but it is on the Editoria roadmap. Options will include same page, back of book, or margin notes.

### What’s the cost to use Editoria?
Using the code to create an instance of Editoria truly is free. Our hope is that organizations that find it useful, will contribute the customizations and additional development code back so that others can use it. We also hope that adopters will help organize and attend community gatherings and participate in discussion and problem solving with the community.

### Does Editoria generate and export EPUB3?
Yes, currently however it is not available via the user interface. This is on our development roadmap.

### Can Editoria export BITS XML (or other) for chapter files and books?
It can. The first conversion is from .docx to HTML, and from there, it’s up to presses to decide what to do with the highly structured, source HTML.

### Can I use Editoria for journals workflow?
It’s possible, but would not be ideal. Coko has developed an open-source tool that is optimized for journals workflow, called xPub. xPub, like Editoria, is modular, so that organizations can develop their own non-hardcoded workflows, mixing and matching modules that other organizations have developed and shared, or create and integrate their own. More at https://coko.foundation/use-cases/

### How do my .docx filenames affect how they upload?
Using the "Upload Word Files" button, you can upload multiple .docx files with one click. A few file naming conventions provide useful controls for how the Word files are uploaded:
* .docx files that begin with "a" go into Frontmatter
* .docx files that beegin with "w" go into Backmatter
* files that start with any other letters go into the Body

Additionally:
* By default, files in the Body are regular, numbered chapters. Frontmatter and backmatter components are always unnumbered.
* a "00" anywhere in filename will make it an unnumbered chapter (only in Body)
* "pt0" anywhere in filename will upload the .docx as a Part (only in Body)