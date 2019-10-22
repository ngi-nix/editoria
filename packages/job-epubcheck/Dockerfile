FROM node:11

WORKDIR /home/node

ARG WAIT_SERVICE_PORT=postgres:5432
ARG WAIT_TIMEOUT=300

ENV WAIT_SERVICE_PORT=$WAIT_SERVICE_PORT
ENV WAIT_TIMEOUT=$WAIT_TIMEOUT

RUN apt-get update \
    && apt-get install -y software-properties-common unzip

RUN apk add --update bash curl unzip openjdk7 && \
  rm /var/cache/apk/*

# Install JS dependencies

COPY package.json .
RUN yarn


COPY . .

RUN chmod +x src/wait-for-it.sh
RUN chmod +x src/service_run.sh


# Start job processing
CMD ["src/service_run.sh"]
