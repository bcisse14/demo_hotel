# syntax=docker/dockerfile:1

# Base image with PHP CLI (bookworm for newer libpq with SNI support)
FROM php:8.3-cli-bookworm AS base

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=prod \
    PATH="/root/.composer/vendor/bin:${PATH}"

# Install system deps and PHP extensions needed for Symfony + Postgres
RUN apt-get update \
     && apt-get install -y --no-install-recommends \
         git unzip pkg-config \
         libicu-dev libpq-dev \
         libzip-dev zlib1g-dev \
         libjpeg-dev libpng-dev libwebp-dev libfreetype6-dev \
     && docker-php-ext-configure intl \
     && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
     && docker-php-ext-install -j$(nproc) intl gd zip pdo pdo_pgsql \
     && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy sources into a temp location regardless of build context
# - If Koyeb builds from repo root: "/src/backend" exists
# - If Koyeb builds with context=backend: project files exist directly in "/src"
COPY . /src

# Normalize sources into /app so composer.json is always at /app/composer.json
RUN set -eux; \
    if [ -f /src/composer.json ]; then \
        cp -a /src/. /app/; \
    elif [ -f /src/backend/composer.json ]; then \
        cp -a /src/backend/. /app/; \
    else \
        echo "composer.json not found in /src or /src/backend" >&2; \
        exit 1; \
    fi

# Install PHP deps (no dev) and optimize autoloader (skip scripts to avoid cache:clear at build time)
RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction --optimize-autoloader \
    && composer dump-autoload --optimize \
    && chmod +x /app/docker/entrypoint.sh

# Expose the port (platform sets $PORT at runtime)
EXPOSE 8000

# Default command does nothing; Render's dockerCommand in render.yaml runs migrations and starts server
CMD ["/app/docker/entrypoint.sh"]
