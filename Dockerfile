FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --ignore-scripts; else npm install --ignore-scripts; fi

COPY . .
ENV SKIP_IMAGEMIN=true
RUN npm run build
RUN if [ -f .env ]; then cp .env /tmp/itempire.env; else : > /tmp/itempire.env; fi

FROM nginx:stable-alpine AS runtime

RUN apk add --no-cache php83 php83-curl php83-fpm php83-mbstring

RUN sed -i -E 's/^[;[:space:]]*clear_env[[:space:]]*=.*/clear_env = no/' /etc/php83/php-fpm.d/www.conf

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/itempire
COPY --from=builder /tmp/itempire.env /etc/itempire/.env
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["sh", "-c", "php-fpm83 -D && exec nginx -g 'daemon off;'"]

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
	CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
