# Start with the official Node.js image
FROM node:18-alpine

# Install any additional dependencies if needed (Alpine uses apk instead of apt-get)
RUN apk update && apk add --no-cache \
    # Add any other dependencies you need

# Set up your application
WORKDIR /app
COPY package*.json ./
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy your NestJS app source code into the container
COPY . .

# Build the NestJS application
RUN npm run build --workspace=api

# Expose the port that NestJS listens to
EXPOSE 3000

# Run the NestJS app
CMD ["node", "dist/apps/api/main.js"]
