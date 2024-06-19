ARG NODE_VERSION=20
FROM alpine as build
RUN apk add nodejs npm
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx tsc 

#production build
FROM alpine 
RUN apk add nodejs npm
WORKDIR /backend
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig.json ./
COPY --from=build /app/.prettierignore /app/.prettierrc ./
COPY --from=build /app/prisma ./
RUN npx prisma generate
EXPOSE 5555
CMD ["npm", "run","start"]
