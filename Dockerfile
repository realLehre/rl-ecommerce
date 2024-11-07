# Start with the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy your NestJS app source code into the container
COPY . .

# Build the NestJS application
RUN npx nx build api --prod

# Expose the port that NestJS listens to
EXPOSE 3000

# Run the NestJS app
CMD ["node", "dist/apps/api/main.js"]
