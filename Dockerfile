ARG BASE_IMAGE_TAG=16-bullseye

FROM node:${BASE_IMAGE_TAG}

# LABEL maintainer "Michael Baudino <michael.baudino@alpine-lab.com>"

# Explicitely define locale
# as advised in https://github.com/docker-library/docs/blob/master/ruby/content.md#encoding
ENV LANG="C.UTF-8"

# Define dependencies base versions
ENV GOSU_VERSION="1.12"

# Define some default variables
ENV PORT="4200" \
    HISTFILE="/config/.bash_history" \
    GIT_COMMITTER_NAME="Just some fake name to be able to git-clone" \
    GIT_COMMITTER_EMAIL="whatever@this-user-is-not-supposed-to-git-push.anyway" \
    EDITOR="vim"

# Install APT dependencies
RUN sed -i '/bullseye-updates/d' /etc/apt/sources.list \
 && apt-get update \
 && apt-get install --assume-yes --no-install-recommends --no-install-suggests \
      apt-transport-https \
      lsb-release \
      libcap2-bin \
 && apt-get update \
 && apt-get install --assume-yes --no-install-recommends --no-install-suggests \
      jq \
      vim \
      tmux \
 && rm -rf /var/lib/apt/lists/*

# Install `gosu`
RUN export GNUPGHOME="$(mktemp -d)" dpkgArch="$(dpkg --print-architecture | cut -d- -f1)" \
 && for keyserver in $(shuf -e keys.gnupg.net ha.pool.sks-keyservers.net hkp://p80.pool.sks-keyservers.net:80 keyserver.ubuntu.com pgp.mit.edu); do \
      gpg --batch --no-tty --keyserver "$keyserver" --recv-keys "B42F6819007F00F88E364FD4036A9C25BF357DD4" && break || :; \
    done \
 && curl -sSL -o /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-${dpkgArch}" \
 && curl -sSL "https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-${dpkgArch}.asc" | gpg --batch --verify - /usr/local/bin/gosu \
 && chmod +x /usr/local/bin/gosu \
 && rm -rf "${GNUPGHOME}"

# Install `Puma-dev` to resolve member.womany.test
RUN curl -s "https://api.github.com/repos/puma/puma-dev/releases/latest" \
    | grep browser_download_url \
    | grep linux-amd64 \
    | cut -d '"' -f 4 \
    | xargs -I {} curl -sSL {} -o "/tmp/puma-dev.tar.gz" \
    && tar zxvf "/tmp/puma-dev.tar.gz" -C "/usr/local/bin/" \
    && timeout 3 "/usr/local/bin/puma-dev" || true \
    && mkdir -p /usr/local/share/ca-certificates \
    && cp ~/.puma-dev-ssl/cert.pem /usr/local/share/ca-certificates/puma-dev-pem.crt \
    && update-ca-certificates \
    && setcap CAP\_NET\_BIND\_SERVICE=+eip "/usr/local/bin/puma-dev" \
    && rm "/tmp/puma-dev.tar.gz"

# Install oh-my-zsh
RUN sh -c "$(curl -sSL https://github.com/deluan/zsh-in-docker/releases/download/v1.1.1/zsh-in-docker.sh)" -- \
       -t robbyrussell \
       -p 'history-substring-search' \
       -a 'bindkey "\$terminfo[kcuu1]" history-substring-search-up' \
       -a 'bindkey "\$terminfo[kcud1]" history-substring-search-down'

# Add dot files to the home directory skeleton (they persist IRB/Pry/Rails console history, configure Yarn, etc…)
# COPY dotfiles/* /etc/skel/

# Configure the main working directory.
WORKDIR /app

# Expose listening port to the Docker host, so we can access it from the outside.
EXPOSE ${PORT}

# Use wrappers that check and maintain Ruby & JS dependencies (if necessary) as entrypoint
COPY bin/*-wrapper /usr/local/bin/
RUN sed -i -e 's/\r$//' /usr/local/bin/*-wrapper
RUN ln -s /usr/local/bin/gosu-wrapper /usr/local/bin/bypass
ENTRYPOINT ["gosu-wrapper", "npm-wrapper"]

# The main command to run when the container starts is to start whatever the Procfile defines
# ENTRYPOINT ["gosu-wrapper", "npm-wrapper", "bash"]
CMD ["ng", "serve", "thunberg-fe", "--host", "0.0.0.0"]
