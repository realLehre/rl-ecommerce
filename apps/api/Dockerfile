# Use the official Node.js image.
FROM node:18

# Set the working directory.
WORKDIR /app

# Copy the root package.json and lock files
COPY package*.json ./

# Copy Nx workspace configuration files to use `nx` commands.
COPY nx.json ./
COPY tsconfig.base.json ./
COPY apps/api ./apps/api
COPY libs ./libs

# Install dependencies (this uses the root package.json).
RUN npm install

# Build the NestJS application
RUN npx nx build apps/api

# Expose port 3000 (or your configured NestJS port)
EXPOSE 3000

# Start the NestJS server
CMD ["node", "dist/apps/api/main.js"]
