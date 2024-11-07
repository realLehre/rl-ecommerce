# Start with the official Node.js image
FROM node:18-alpine

# Install dependencies
RUN apt-get update && apt-get install -y \
    # Add any other dependencies you need

# Set up your application
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy your NestJS app source code into the container
COPY . .

# Build the NestJS application
RUN npx nx build api --prod

# Expose the port that NestJS listens to
EXPOSE 3000

# Run the NestJS app
CMD ["node", "dist/apps/api/main.js"]
