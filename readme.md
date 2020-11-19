### Recipe


## Getting started

Project is contained using docker, go ahead and install docker if you don't have it on your system.

To start the app in production mode,

  - RUN yarn prod

To start the app in development mode,

  - Run yarn ddev

To run the tests,

  - RUN yarn dtest

  This runs both integration and unit tests.

Check the package.json scripts for linter and prettier commands to run.

## DATABASE

Database used is MongoDB, and the ODM used is mongoose.
REDIS is also used in the project, mostly for caching responses.

## PAGINATION

Cursor based pagination is being used as that's faster to using offet pagination.

## API DOCUMENTATION

Please check here for documentation on the api endpoints.