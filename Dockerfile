# Use Node.js 20 for better Next.js compatibility
FROM node:20-alpine

# Install necessary utilities
RUN apk add --no-cache tree

# Set working directory
WORKDIR /

# Debug: List contents before copy
RUN echo "Contents of build context before copy:"
RUN pwd && ls -la

# Copy package files first
COPY package*.json ./

# Debug: Verify package.json was copied
RUN echo "Contents after copying package.json:" && \
    ls -la && \
    if [ ! -f package.json ]; then \
      echo "Error: package.json not found!" && \
      exit 1; \
    fi

# Install dependencies
RUN npm install -f

# Copy the rest of the application
COPY . .

# Debug: Show final structure
RUN echo "Final project structure:" && tree

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
