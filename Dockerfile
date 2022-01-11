FROM node:16.13.1

# Create application directory
WORKDIR /opt/hive-http-proxy

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production

# Copy application source
COPY . .

ENV NODE_ENV production
EXPOSE 3000
CMD [ "npm", "start" ]
