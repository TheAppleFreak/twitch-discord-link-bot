FROM node:16 AS build

# Copy package.json for build
WORKDIR /appsrc
COPY package.json package-lock.json ./
RUN npm install --no-optional

# Copy package.json for prod
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=prod --no-optional --ignore-scripts

# Build application and move to prod directory
WORKDIR /appsrc

COPY tsconfig.json ./
COPY src /appsrc/src
COPY prisma /appsrc/prisma
RUN npx prisma generate && \
    npm run build

RUN mv build prisma -t /app && \
    mv node_modules/.prisma -t /app/node_modules

# Switch to the production stage
FROM node:16-alpine 
WORKDIR /app

COPY --from=build /app /app

CMD ["node", "build/broker.js"]