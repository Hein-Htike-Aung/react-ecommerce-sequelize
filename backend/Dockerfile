FROM node:latest

RUN yarn global add nodemon
WORKDIR /
ADD package*.json ./
RUN npm install
# EXPOSE 6379
RUN npm install pm2 -g
COPY . .

CMD ["pm2-runtime", ".js"]