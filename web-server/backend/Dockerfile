# Use a lightweight Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y build-essential python3 make g++

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Rebuild serialport native bindings
RUN npm rebuild @serialport/bindings --build-from-source

# Expose port and start app
EXPOSE 3000
CMD ["node", "src/server.js"]
