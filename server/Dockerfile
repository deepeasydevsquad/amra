FROM node:20.18

WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon secara global
RUN npm install -g nodemon

# Salin kode server
COPY . .

EXPOSE 3001

# Jalankan dengan nodemon untuk auto-restart pada perubahan file
CMD ["npm", "start"]  
