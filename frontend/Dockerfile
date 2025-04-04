# React build vaihe
FROM node:18 as build
WORKDIR /app
COPY package*.json ./

# Asenna riippuvuudet ja tyypitykset
RUN npm install
RUN npm install --save-dev @types/react-dom

COPY . .
RUN npm run build

# Nginx vaihe
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
