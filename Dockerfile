WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "start"]

