FROM public.ecr.aws/docker/library/node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Copy all source code
COPY . .

# Expose port for development
EXPOSE 3000

# Command to run in development mode with hot-reload
CMD ["npm", "run", "dev"]