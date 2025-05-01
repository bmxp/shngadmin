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

## ng update <package>

This command will update the given packages and usually scans if some changes are to be done within the code. It is highly advised to upgrade packages together that also are dependent on each other. 
E.g. ``ng update @ngx-translate/core@14 @ngx-translate/http-loader@7``

# Updating to the next Angular version

**primeng** will change with every Angular version so it needs to be checked and updated always.
**ngx-bootstrap** see required versions at https://github.com/valor-software/ngx-bootstrap/blob/development/README.md
**@fortawesome/angular-fontawesome** see required versiobs at https://www.npmjs.com/package/@fortawesome/angular-fontawesome
**@ngx-translate/core** + **@ngx-translate/http-loader** compatability table found at https://github.com/ngx-translate/core#installation

Update **version** of shngadmin in both ``.\package.json`` and also ``.\src\app\app.component.ts``


## Angular 12

Tells it needs Node.js >= 18

Should have been updated @ctrl/ngx-codemirror@^5.1.1 for Angular 12.x-14.x --> 

## Angular 13

``ng update @angular/core@13 @angular/cli@13 @angular-eslint/schematics@13``
``ng update @angular/cdk@13 primeng@13``
``ng update ngx-bootstrap@8``

The two packages are valid up and including until Angular 15.
``ng update @ngx-translate/core@14``
``ng update @ngx-translate/http-loader@7``
Angular 16 will wither need both with version 16 or version 15 and 8 with adaptions. 
**Watchout!!!!**

``ng update @ctrl/ngx-codemirror@^5.1.1``


## Angular 14

- Needs Node 14.15.0 or later

``ng update @angular/core@14 @angular/cli@14 @angular-eslint/schematics@14``

``ng update @angular/cdk@14 primeng@14``
``ng update ngx-bootstrap@9``


## Angular 15

See official update guide at https://angular.dev/update-guide?v=14.0-15.0&l=1

- Needs Node 14.20.0 or later
- needs typescript 4.8 or later

``ng update @angular/core@15 @angular/cli@15 @angular-eslint/schematics@15``
``ng update @angular/cdk@15 primeng@15``
``ng update ngx-bootstrap@10``
``ng update @ctrl/ngx-codemirror@^6.1.0``

===============================
**Aktueller Stand der Updates**
===============================

## Angular 16

``ng update ngx-bootstrap@11``

**Watchout!!!!**
These two packages need an update
``ng update @ngx-translate/core@16 @ngx-translate/http-loader@16``
            or 
``ng update @ngx-translate/core@15 @ngx-translate/http-loader@8``
Angular 16 will wither need both with version 16 or version 15 and 8 with adaptions. 

``ng update @ctrl/ngx-codemirror@^7.0.0``
Needs also codemirror@5 but it was at ^5.43.0 anyway in package.json and installed as 5.65.19 (latest 5.x)

## Angular 17

``ng update ngx-bootstrap@12``

## Angular 18

``ng update ngx-bootstrap@18``

## Angular 19

``ng update ngx-bootstrap@19``

