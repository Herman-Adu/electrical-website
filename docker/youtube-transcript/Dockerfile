FROM node:22-alpine

WORKDIR /srv

# Install youtube-transcript package and patch it to load as CJS
RUN npm install --no-save youtube-transcript && \
    cp node_modules/youtube-transcript/dist/youtube-transcript.common.js \
       node_modules/youtube-transcript/dist/youtube-transcript.common.cjs

# Copy the v3 server and its ESM module loader
COPY server-v3.js server.cjs
COPY youtube-loader.cjs youtube-loader.cjs

EXPOSE 8000

HEALTHCHECK --interval=10s --timeout=3s --retries=5 --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8000/health

CMD ["node", "server.cjs"]
