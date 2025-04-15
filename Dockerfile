# Use Node.js base image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Start the application
CMD ["node", "app.js"]
