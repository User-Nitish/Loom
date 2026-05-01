FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (and build tools for bcrypt)
RUN apk add --no-cache python3 make g++ && npm install --production

# Copy source code
COPY . .

# Expose port (as seen in server/app.js or package.json proxy)
EXPOSE 4000

# Start the application
CMD ["npm", "run", "production"]
