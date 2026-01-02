FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY backend/ .

# Build TypeScript
RUN npm run build

# Expose port (Railway sets PORT automatically)
EXPOSE ${PORT:-8080}

# Start server
CMD ["npm", "start"]

