# shngadmin
Admin interface for SmartHomeNG - EXPERIMENTAL - Source code for the Angular App which is included in the admin-module of SmartHomeNG


---


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.1.

### --> The installed/used version of node.js is v12.20.0 (check with 'nvm current' command)

If the actually used version of node does not match the requirements, change it
with the 'nvm use <version>' command -> 'nvm use 12'


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### --> ng build --prod --aot --base-href /admin/

afterwards copy the content (files and subdirectories) of shngadmin/dist (the directory **static**) to the admin module of SmartHomeNG in the directory **webif**. Clear all existing files and 
folders within modules/admin/webif/static and copy the files that were just created by ng build to the modules/admin/webif/static folder.

Afterwards commint and push the changes you just made to the admin module to the smarthome repository.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).\
Run `npm run e2e` to execute the tests via [Cypress](https://www.cypress.io/.)

## Create a component

Run 'ng generate component new_comp' to create a new component

### --> ng generate component logics/logics-new-comp


## Hints

### Re-Render

https://stackoverflow.com/questions/50383003/how-to-re-render-a-component-manually-angular-5

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

