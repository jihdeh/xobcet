FROM node:12

# Create app directory
WORKDIR /usr/src/recipe-app

# Install app dependencies
COPY package.json ./

COPY yarn.lock ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .