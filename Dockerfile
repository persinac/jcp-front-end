# ==== CONFIGURE =====
FROM node:23-alpine
RUN apk update
RUN apk add vim
RUN apk add lsof

RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

# https://community.doppler.com/t/how-to-pass-service-token-in-dockerfile/176/3
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN ${DOPPLER_TOKEN}

WORKDIR /app
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
RUN npm run build:prod

# ==== RUN =======
ENV NODE_ENV production
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]