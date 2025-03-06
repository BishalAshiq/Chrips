# Step 1: Use Node.js base image for building
FROM node:23.1.0-alpine AS builder

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files and install all dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Step 4: Copy the source code
COPY . .

# Step 5: Build the Next.js app
RUN npm run build

# Step 6: Use a lightweight Node.js image for production
FROM node:23.1.0-alpine

# Step 7: Set the working directory
WORKDIR /app

# Step 8: Copy only necessary files from the builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Step 9: Expose the application port
EXPOSE 3000

# Step 10: Run the Next.js production server
CMD ["npm", "start"]
