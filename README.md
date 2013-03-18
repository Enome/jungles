# Jungles

In this repo you find the building blocks to create a CMS. This is meant for developers that know Node.js and Express.js. Knowing angular.js helps to customize the backend admin panel.

## Want to help out?

If you want to help out you can mostly find me in #express on freenode (ping pickels) or create an issue here on Github.

## Want to get started?

### Quick start

```sh
git clone git://github.com/Enome/jungles-getting-started.git && cd jungles-getting-started && npm install && node app.js
```

### Tutorial

Checkout the [getting started](http://github.com/Enome/jungles-getting-started) tutorial.

## Modules

- **auth-persona:** This is a Express.js app you can mount that adds Mozilla persona authentication.
- **components:** Angular.js components to add extra controls to your forms.
- **data-memory:** This is a data layer for your rest service which stores your data in memory.
- **data-postgres:** This is a data layer for your rest service which stores your data in postgres.
- **data:** Create your own data layer for Jungles with this module.
- **errors:** Middleware to handle errors.
- **files**: Express.js app to store and serve files (file server).
- **helpers-frontend:** helpers for your front-end website. 
- **middleware-frontend:** middleware for your front-end website.
- **middleware-general**: General purpose middleware.
- **panel:** Express.js app you can mount to give you an admin panel for your rest service. Client side tech is Angular.js
- **rest:** This is an Express.js app you can mount which gives you a rest API for your front-end.
- **Types:** This combines the datalayer and validation to create a module for entering data with validation.
- **vagrant:** This is a vagrant setup containing the postgresql database to test data-postgres.
- **validation:** module that the rest service uses to validate incoming data.
- **validators:** validators used by the validation module.

## License

MIT
