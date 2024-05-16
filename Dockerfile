FROM node:21 AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent

COPY . ./
RUN npm run build

# Running the app
CMD [ "npm", "start" ]

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
