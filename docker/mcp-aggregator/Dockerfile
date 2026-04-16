FROM node:22-alpine

WORKDIR /srv

COPY package.json ./
RUN npm install --omit=dev

COPY server.mjs ./

EXPOSE 8000

HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=20s \
  CMD wget -qO- http://127.0.0.1:8000/health || exit 1

CMD ["node", "server.mjs"]
