FROM node:18

WORKDIR /app
COPY . .
RUN npm install 
RUN npm install tsx
EXPOSE 4000

CMD [ "npx", "tsx", "./src/index.ts" ]