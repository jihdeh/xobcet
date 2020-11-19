FROM node:12

# Create app directory
ADD . /usr/src/recipe-app
WORKDIR /usr/src/recipe-app

# Install app dependencies
RUN yarn