## Recipe


### Getting started

Project is contained using docker, go ahead and install docker if you don't have it on your system.

To start the app in production mode,

  - RUN `yarn prod`

To start the app in development mode,

  - Run `yarn ddev`

To run the tests,

  - RUN `yarn dtest`

  This runs both integration and unit tests.

Check the *package.json* scripts for linter and prettier commands to run.

### Database

Database used is MongoDB, and the ODM used is mongoose.

REDIS is also used in the project, mostly for caching responses.

### Authentication

Authentication mechanism uses the Basic Auth method, requiring you to pass a username and a password, the username for this test is username, and the password is password.

### Pagination

Cursor based pagination is being used as that's faster to using offet pagination.

## API Documentation

Please [check here](api.md) for documentation on the api endpoints.