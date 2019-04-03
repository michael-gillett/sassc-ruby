FROM ruby:2.3.8-alpine

# Create "appuser"
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser -h /home/appuser appuser

RUN apk add --update --no-cache \
    nodejs \
    nodejs-npm \
    python \
    openssh-client \
    git \
    build-base \
    mysql-dev \
    tzdata

# System
RUN TZ=America/Los_Angeles ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Working Directory
WORKDIR /home/appuser/go_links
RUN chown appuser:appuser /home/appuser/go_links
USER appuser:appuser

# Production Environment
ENV RAILS_ENV=production \
    RAILS_SERVE_STATIC_FILES=true \
    NODE_ENV=production \
    GO_LINKS_DATABASE_URL= 

# App Config
COPY --chown=appuser:appuser Gemfile Gemfile.lock ./
RUN gem install bundler -v 1.17.3
RUN bundle install --deployment --without development test --jobs 30 && \
    bundle clean

# Install packages
COPY --chown=appuser:appuser package.json package-lock.json .npmrc ./
RUN npm run install:packages

# Copy application files that are unlikely to change
COPY --chown=appuser:appuser config config
# once config dir has been copies move the database.docker.yml to database.yml
RUN mv config/database.docker.yml config/database.yml
COPY --chown=appuser:appuser bin bin
COPY --chown=appuser:appuser db db
COPY --chown=appuser:appuser lib lib
COPY --chown=appuser:appuser public public
COPY --chown=appuser:appuser Rakefile ./
COPY --chown=appuser:appuser config.ru ./

# Copy app directory
COPY --chown=appuser:appuser app app

# webpack
COPY --chown=appuser:appuser webpack.config.js ./
RUN npm run webpack

# Rails asset pipeline. Runs here due to Rake having dependencies
# on a ton of files.
# see https://blog.eq8.eu/article/rails-assets-pipeline-and-docker.html for problems with this. Ignoring for now
RUN bundle exec rake assets:precompile


EXPOSE 3000
CMD ["bundle", "exec", "rails", "server"]

