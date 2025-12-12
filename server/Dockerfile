# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY src ./src

# Expose port
EXPOSE 15151

# Wait for database and run migrations, then start the server
CMD npx prisma migrate deploy && npm start
