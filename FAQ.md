## FAQ

### I'm getting user errors running `yarn start:postgres` or `yarn server`

It's crucial to use the same user when installing Editoria and running the Editoria database services. These commands are:

- Running `yarn` from Editoria's root directory. This installs Editoria and its dependencies
- Running `yarn start:postgres` for the first time sets up a database to use with Editoria. This configures a database that expects that the same user that is running this command has also run `yarn` from Editoria's root directory.

If you see user errors running `yarn start:postgres` or `yarn server`, your best bet is to clear the existing database as well as your node_modules and start installing the app from the beginning.

First, delete all the Docker data:

```
docker-compose down
docker-compose rm -fv
rm -rf database
rm -rf node_modules
```

Then, follow the steps for a clean install.

### When running `yarn start:postgres`, I get a `Bind for 0.0.0.0:5432 failed: port is already allocated` error

Something (probably postgres) is already running on the port that the Docker database services try to use (5432). Solution for Ubuntu:

1. `lsof -i tcp:5432`: lists the processes running on port 5432
2. `kill -9 {PID}`: kills (gracelessly) the process. Get the PID from the output of the above step.

This should free up the port so the Docker database services can run on it.

### I've made changes on my `<profile>.env` file, how can these changes be applied?

To be sure that your changes in `<profile>.env` are registered, you need to reset your docker containers and source `<your-env-file>`. To do so, you can follow these steps:

- Kill any running instances of Editoria app

- On editoria-app root folder perform:

```
docker-compose down
docker-compose rm -fv
```

`docker-compose down` will unmount the docker container

`docker-compose rm -fv` will remove the container and it's anonymous volumes.

`rm -rf database` will delete the content from your database

- Now you could run `source <your-env-file>` and start again the services and server

### Which are the absolute required key-value pairs for an env file?

- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- POSTGRES_PORT

These values are needed in order the docker container which hosts the PostrgesDB of the application to be initialized correctly.

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

- .docx files that begin with "a" go into Frontmatter
- .docx files that begin with "w" go into Backmatter
- files that start with any other letters go into the Body

Additionally:

- By default, files in the Body are regular, numbered chapters. Frontmatter and backmatter components are always unnumbered.
- a "00" anywhere in filename will make it an unnumbered chapter (only in Body)
- "pt0" anywhere in filename will upload the .docx as a Part (only in Body)
