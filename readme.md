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

For the sake of this test, the contents of env.example is auto copied into an .env file on command run

### Database

Database used is MongoDB, and the ODM used is mongoose.

REDIS is also used in the project, mostly for caching responses.

### Authentication

Authentication mechanism uses the Basic Auth method, requiring you to pass a username and a password, the username for this test is username, and the password is password.

### Pagination

Cursor based pagination is being used as that's faster to using offet pagination.

### API Documentation

Please [check here](api.md) for documentation on the api endpoints.

### Server

Built on top of nodejs http.server module, i created a mini package to wrap the module to reuse in this project. This helps writing out the endpoints receiving requests neater, modular, and testable.

Link to module can be found here [https://github.com/jihdeh/mini-servlet](https://github.com/jihdeh/mini-servlet)

### Issues

- If you run into an issue with docker, saying ERROR: toomanyrequests: Too Many Requests., you'd have to create an account with docker and then run docker login to increase the pull requests from 100 to 200, if you have already an account, then well you have to either upgrade or wait 6hrs to try again. [https://www.docker.com/increase-rate-limits](https://www.docker.com/increase-rate-limits)