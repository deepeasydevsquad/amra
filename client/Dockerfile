# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage with Apache
FROM httpd:alpine as production-stage

# Salin built files ke folder publik Apache
COPY --from=build-stage /app/dist/ /usr/local/apache2/htdocs/

# Salin .htaccess untuk mengatur routing Vue
COPY .htaccess /usr/local/apache2/htdocs/.htaccess

# Modifikasi konfigurasi Apache agar dapat membaca .htaccess dan memungkinkan mod_rewrite
RUN echo '<Directory "/usr/local/apache2/htdocs">' >> /usr/local/apache2/conf/httpd.conf && \
    echo '    AllowOverride All' >> /usr/local/apache2/conf/httpd.conf && \
    echo '    Require all granted' >> /usr/local/apache2/conf/httpd.conf && \
    echo '</Directory>' >> /usr/local/apache2/conf/httpd.conf

# Pastikan mod_rewrite aktif
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf

# Expose port 80
EXPOSE 80

# Jalankan Apache di foreground
CMD ["httpd-foreground"]

