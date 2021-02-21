FROM node:14-alpine
WORKDIR /app
COPY www ./www
COPY services ./services
COPY lib ./lib
COPY server.js config.js package.json package-lock.json ./
RUN npm install
ENV DEBUG=Server,SSH
EXPOSE 51821
CMD ["node", "server.js"]