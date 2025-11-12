FROM node:20-alpine3.18

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Inject environment variable
ARG NEXT_PUBLIC_API_BASE_URL_PROD
ENV NEXT_PUBLIC_API_BASE_URL_PROD=$NEXT_PUBLIC_API_BASE_URL_PROD

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]