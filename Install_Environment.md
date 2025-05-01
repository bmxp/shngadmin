# Install Environment

This is a short guide to install the environment to build the **shngadmin** application.

The Node Version Manager **nvm** is needed to install **Node.js** at first step

```
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 18

# Verify the Node.js version:
node -v # Should print "v18.20.8".
nvm current # Should print "v18.20.8".

# Verify npm version:
npm -v # Should print "10.8.2".
```

Then download source files for shngadmin from repository

```
mk shngadmin
cd shngadmin
git clone https://github.com/smarthomeNG/shngadmin.git .
``` 

The repo brings a ``package.json`` with all needed packages. Run ``npm install`` to set it all up.
There might be warnings about peer packages not being provided. Just ignore them at first.

# Test drive!

Having all packages installed we can start a development server with

``NODE_OPTIONS=--openssl-legacy-provider ng serve``

This runs a server with test data on ``http://localhost:4200``

(Omitting the NODE_OPTIONS setting for openssl above will result in an error)


# Build a distribution of shngadmin


``NODE_OPTIONS="--trace-deprecation --trace-warnings" ng build --configuration production --aot --base-href /admin/``

To be used with SmartHomeNG, shngadmin needs to be included in the **static** folder of the module **admin**
copy the contents of the newly created ``dist`` folder to the **static** folder of module **admin**


# Hints

Different versions of Node can be changedwith the Node Version Manager nvm.

``nvm install 20`` will setup and install the latest Node 20 Package

``nvm use 12`` will switch current used Node version to 12.

# Updating to the next Angular version

**primeng** will change with every Angular version so it needs to be checked and updated always.
**ngx-bootstrap** see required versions at https://github.com/valor-software/ngx-bootstrap/blob/development/README.md
**@fortawesome/angular-fontawesome** see required versiobs at https://www.npmjs.com/package/@fortawesome/angular-fontawesome

Update **version** of shngadmin in both ``.\package.json`` and also ``.\src\app\app.component.ts``


## Angular 12

Tells it needs Node.js >= 18

## Angular 13

``ng update @angular/core@13 @angular/cli@13 @angular-eslint/schematics@13``
``ng update @angular/cdk@13 primeng@13``
``ng update ngx-bootstrap@8``

===============================
**Aktueller Stand der Updates**
===============================

``ng update @ngx-translate/core@14``


## Angular 14

## Angular 15


## Angular 16

## Angular 17

## Angular 18

## Angular 19



