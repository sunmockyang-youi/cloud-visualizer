FROM node:boron

# Create app directory
WORKDIR /app

# Copy the client code
COPY client/ client/

# Copy the server code
COPY server/src/ server/src/
COPY server/package.json server/ 

WORKDIR /app/server
RUN npm install --production

EXPOSE 8080
CMD ["node", "src"]