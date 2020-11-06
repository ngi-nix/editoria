FROM node:11

ARG WAIT_SERVICE_PORT=postgres:5432
ARG WAIT_TIMEOUT=300

ENV WAIT_SERVICE_PORT=$WAIT_SERVICE_PORT
ENV WAIT_TIMEOUT=$WAIT_TIMEOUT

# Install ghostscript
RUN apt-get update && \
		apt-get install -y build-essential make gcc g++ && \
		apt-get -y install ghostscript && apt-get clean && \
		apt-get install -y libgs-dev && \
		rm -rf /var/lib/apt/lists/*

# See https://github.com/GoogleChrome/puppeteer/blob/master/.ci/node12/Dockerfile.linux
RUN apt-get update && \
		apt-get -y install xvfb gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
			libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
			libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
			libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
			libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget && \
		rm -rf /var/lib/apt/lists/*

# Update Freetype
COPY services/job-pdf/docker-font.conf /etc/fonts/local.conf
ENV FREETYPE_PROPERTIES="truetype:interpreter-version=35"
RUN apt-get update \
		&& sh -c 'echo "deb http://http.us.debian.org/debian stable main contrib non-free" >> /etc/apt/sources.list' \
		&& apt-get update \
		&& apt-get install -y ttf-mscorefonts-installer \
			--no-install-recommends \
		&& rm -rf /var/lib/apt/lists/*

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
		&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
		&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome-unstable.list' \
		&& apt-get update \
		&& apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
			--no-install-recommends \
		&& rm -rf /var/lib/apt/lists/* \
		&& apt-get purge --auto-remove -y curl \
		&& rm -rf /src/*.deb

# helps prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init



RUN apt-get update && \
		apt-get install -y vim && \
		rm -rf /var/lib/apt/lists/*

RUN npm install npm@latest -g
RUN npm install -g node-gyp

RUN adduser node audio \
		&& adduser node video \
		&& mkdir -p /home/node/Downloads \
		&& chown -R node:node /home/node \
		&& chown -R node:node /usr/lib 

USER node
WORKDIR /home/node


COPY --chown=node:node services/job-pdf/package.json .
RUN npm install
RUN npm install ghostscript4js


COPY --chown=node:node services/job-pdf .

RUN chmod +x src/wait-for-it.sh
RUN chmod +x src/service_run.sh


# Start job processing
CMD ["src/service_run.sh"]
