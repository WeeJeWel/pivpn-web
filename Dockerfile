FROM node:14-alpine
WORKDIR /app
COPY www ./www
COPY services ./services
COPY lib ./lib
COPY server.js config.js package.json package-lock.json ./
RUN npm ci --production
ENV DEBUG=Server,SSH
EXPOSE 51821
CMD ["node", "server.js"]