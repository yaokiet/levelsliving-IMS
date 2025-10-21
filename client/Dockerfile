# Stage 1: Build Stage
FROM public.ecr.aws/docker/library/node:22-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM public.ecr.aws/docker/library/node:22-alpine AS runner

WORKDIR /app

# Copy only the built application and necessary files from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your app runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]