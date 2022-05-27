# Install Environment

This is a short guide to install the environment to build the **shngadmin** application.


## Install node.js

Visit https://nodejs.org/en/ - Download Latest Version 10.x.x Current - Install Package

Installs 
- Node.js v10.7.0 in /usr/local/bin/node and 
- npm v6.10 in /usr/local/bin/npm

## Install Angular

- sudo npm install -g @angular/cli

### To create a new Angular app: 
- cd \<project root folder>
- ng new my-dream-app &nbsp; &nbsp;  &nbsp; to create a new angular app "my-dream-app"
- cd my-dream-app
- ng serve

## Install needed packages

If packages are are needed, install them using the command npm install


# Build a distribution of shngadmin

To be used, shngadmin needs to be included in the **static** folder of the module **admin** 

- quit ngserve
- ng build --prod --aot --base-href /admin/
- copy the contents of the newly created dist/shngadmin folder to the **static** folder of module **admin**



