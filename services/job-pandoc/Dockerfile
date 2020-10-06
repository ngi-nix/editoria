FROM node:11

WORKDIR /home/node

ARG WAIT_SERVICE_PORT=postgres:5432
ARG WAIT_TIMEOUT=300

ENV WAIT_SERVICE_PORT=$WAIT_SERVICE_PORT
ENV WAIT_TIMEOUT=$WAIT_TIMEOUT

RUN wget https://github.com/jgm/pandoc/releases/download/2.7.3/pandoc-2.7.3-1-amd64.deb -O pandoc.deb; dpkg -i pandoc.deb; rm pandoc.deb

# Install JS dependencies
COPY packages/job-pandoc/package.json .
RUN yarn cache clean
RUN yarn


COPY packages/job-pandoc .
RUN chmod +x src/wait-for-it.sh
RUN chmod +x src/service_run.sh


# Start job processing
CMD ["src/service_run.sh"]
