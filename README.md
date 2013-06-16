# Jungles

Content management system for Node.js. All parts are modules and most of them are optional and replaceable. While Jungles is great for creating a content site it's also easy to use it as a content layer for your an existing Node.js application.

## Developers develop

Configuration is all done in Javascript which means you can version control, use deployment scripts and work with multiple developers on one site.

## Content editors create content

Jungles uses a user friendly control panel without any configuration forms. This means that content editors can focus on creating content.

## Want to help or need help?

It's not perfect yet, if you need help or want to help out find me at #jungles on freenode (ping pickels) or create an issue here on Github.

## Getting started

https://github.com/Enome/jungles-tutorial

## Modules

- **auth-persona:** This is a Express.js app you can mount that adds Mozilla persona authentication.
- **auth-simple:** Simple authorization module.
- **components:** Angular.js components to add extra controls to your forms.
- **data-memory:** This is a data layer for your rest service which stores your data in memory.
- **data-postgres:** This is a data layer for your rest service which stores your data in postgres.
- **data:** Test suite for data layers.
- **errors:** Middleware to handle errors.
- **files**: Express.js app to store and serve files (file server).
- **functions**: shared functionality used by multiple modules.
- **helpers-frontend:** helpers for your front-end website. 
- **jungles:** this main module bundles all the modules you need to setup Jungles.
- **middleware-frontend:** middleware for your front-end website.
- **middleware-general**: General purpose middleware.
- **panel:** Express.js app you can mount to give you an admin panel for your rest service. Client side tech is Angular.js
- **resources:** Fireworks and photoshop designs.
- **rest:** This is an Express.js app you can mount which gives you a rest API for your front-end.
- **Types:** This combines the data layer and validation to create a module for entering data with validation.
- **vagrant:** This is a vagrant setup containing the postgresql database to test data-postgres.
- **validation:** module that the rest service uses to validate incoming data.
- **validators:** validators used by the validation module.

## License

MIT
