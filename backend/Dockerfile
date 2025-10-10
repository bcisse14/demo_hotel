# syntax=docker/dockerfile:1

# Base image with PHP CLI
FROM php:8.3-cli-bullseye AS base

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=prod \
    PATH="/root/.composer/vendor/bin:${PATH}"

# Install system deps and PHP extensions needed for Symfony + Postgres
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git unzip libicu-dev libpq-dev libzip-dev libjpeg-dev libpng-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install -j$(nproc) intl gd zip pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy app files
COPY . /app

# Install PHP deps (no dev) and optimize autoloader
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader \
    && composer dump-autoload --optimize

# Expose the port (Render sets $PORT at runtime)
EXPOSE 8080

# Default command does nothing; Render's dockerCommand in render.yaml runs migrations and starts server
CMD ["php", "-v"]
