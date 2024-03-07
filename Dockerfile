FROM node:20.11.1-alpine3.19 AS build
# RUN  addgroup app && adduser -S -G app app
# RUN mkdir /app && chown app:app /app
# USER app
WORKDIR /app
RUN mkdir data
COPY package*.json .
RUN npm install @angular/cli -g
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]


# FROM node:20-alpine AS build
# WORKDIR /app

# COPY . .
# RUN npm install
# RUN npm run build

# # Serve Application using Nginx Server
# FROM nginx:alpine
# COPY --from=build /app/dist/dynamic-form-builder/ /usr/share/nginx/html
# EXPOSE 80