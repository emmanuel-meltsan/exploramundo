FROM node:23

WORKDIR /home/appExplopaises/exploramundo

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
