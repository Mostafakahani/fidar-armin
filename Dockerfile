# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Clean install dependencies
RUN npm ci

RUN npm install -f
# Copy the rest of the application
COPY . .

# Set production environment
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
