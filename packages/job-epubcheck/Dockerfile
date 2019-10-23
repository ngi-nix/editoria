FROM node:11

WORKDIR /home/node

ARG WAIT_SERVICE_PORT=postgres:5432
ARG WAIT_TIMEOUT=300

ENV WAIT_SERVICE_PORT=$WAIT_SERVICE_PORT
ENV WAIT_TIMEOUT=$WAIT_TIMEOUT

RUN apt-get update \
    && apt-get install -y software-properties-common unzip

RUN add-apt-repository 'deb http://http.debian.net/debian stretch-backports main' \
    && apt-get update \
    && apt-get install -y openjdk-11-jre-headless


# Install JS dependencies
COPY packages/job-epubcheck/package.json .
RUN yarn cache clean
RUN yarn


COPY packages/job-epubcheck .
RUN chmod +x src/wait-for-it.sh
RUN chmod +x src/service_run.sh


# Start job processing
CMD ["src/service_run.sh"]
