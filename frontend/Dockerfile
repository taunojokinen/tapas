FROM node:18

# Luo työhakemisto
WORKDIR /app

# Kopioi vain riippuvuustiedostot ja asenna
COPY package.json package-lock.json* ./
RUN npm install

# Kopioi loppu koodi
COPY . .

# Ympäristömuuttujat: hot reload + container access
ENV CHOKIDAR_USEPOLLING=true
ENV HOST=0.0.0.0
ENV WATCHPACK_POLLING=true

# Portti käyttöön
EXPOSE 3000

# Aja dev-server ilman sidosta aktiiviseen TTY:yn
CMD ["npm", "react-scripts", "start"]
