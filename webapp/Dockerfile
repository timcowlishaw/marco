FROM node:12
WORKDIR /srv
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "serve"]