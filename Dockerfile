# ---- build stage -------------------------------------------------------------
# Node image builds the static site. None of Node/npm ships in the final image -
# only the compiled dist/ folder is copied into nginx below.
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first (cached until package*.json change). `npm ci` installs the
# exact versions from package-lock.json - reproducible, unlike `npm install`.
COPY package.json package-lock.json ./
RUN npm ci

# VITE_API_URL is a BUILD-TIME value: Vite inlines import.meta.env.VITE_API_URL
# into the JS bundle during `npm run build`. It cannot be changed at container
# runtime - to point at a different API you rebuild with a different ARG.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ---- run stage ---------------------------------------------------------------
# nginx serves the static files. Tiny, fast, and handles the SPA fallback.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
