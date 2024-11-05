# Use a Node.js base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NX application
RUN npx nx build api

# Expose the port your NestJS app will run on
EXPOSE 3000

# Start the application
CMD ["node", "dist/apps/api/main.js"]
