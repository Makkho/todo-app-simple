FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY app.js .
COPY public ./public

USER node
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost/health', (r) => { if (r.statusCode !== 200) process.exit(1) })"

CMD ["npm", "start"]
