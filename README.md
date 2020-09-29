# Editoria

This is the Editoria monorepo.

It consists of the main Editoria application, as well as the different [Pubsweet](https://gitlab.coko.foundation/pubsweet) components and helper libraries that the app is made of.

This application is being developed by the [Coko Foundation](https://coko.foundation/) for the Editoria Community.  
For more information, visit the project's [website](https://editoria.pub/) or our [chat channel](https://mattermost.coko.foundation/coko/channels/editoria).  
For the editor that Editoria uses, see its related project [Wax](https://gitlab.coko.foundation/wax).

## Roadmap 2020

The following are our goals until the end of the year:

- Move everything to a single repo
- Figure out and implement the simplest way to authenticate between services
- Separate services (pagedjs & epubcheck) from the app and remove filesystem dependencies in favour of sending files over http
- Dockerize the app
- UI improvements

You can track the above plan in more detail in its [milestone](https://gitlab.coko.foundation/editoria/editoria/-/milestones/12).

You are also in discussions about an Editoria design upgrade, which you can track with [these issues](https://gitlab.coko.foundation/editoria/editoria/issues?label_name%5B%5D=Editoria+2020+Review).

## Editoria's flavors

Currently the application exists in three different flavours each one containing its' own customizations based on required functionalities

- [Editoria Vanilla](https://gitlab.coko.foundation/editoria/editoria-vanilla)
- [Editoria UCP](https://gitlab.coko.foundation/editoria/ucp)
- [Editoria BookSprints](https://gitlab.coko.foundation/editoria/booksprints)

The vanilla flavor includes all the features implemented by the development team and should be considered as the referesh application.

## I want to try it

In order to try the application, you should navigate and clone one of its' flavors and follow the getting up and running instructions
