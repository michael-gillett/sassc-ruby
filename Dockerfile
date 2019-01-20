FROM ruby:2.3.0

# Create "appuser"
RUN groupadd -g 999 appuser && \
    useradd -r -u 999 -g appuser -m -d /home/appuser appuser


# System
RUN apt-get update
RUN TZ=America/Los_Angeles ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install node
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash && apt-get install -y nodejs \
  && npm i -g webpack

# Working Directory
ENV APP_ROOT=/home/appuser/go_links
RUN mkdir -p $APP_ROOT
WORKDIR $APP_ROOT

# Production Environment
ENV RAILS_ENV=production

# we can use this once we reorganize the package.json
# ENV NODE_ENV=production

# App Config
COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 1.16.3
RUN bundle install --deployment --jobs 30 && \
    bundle clean

# Copy application files that are unlikely to change
COPY config config
RUN mv config/database.docker.yml config/database.yml
COPY bin bin
COPY db db
COPY public public
COPY Rakefile ./
COPY config.ru ./

# Copy app directory
COPY app app

# Install packages and run webpack
COPY package.json package-lock.json .npmrc ./
RUN npm run install:packages
# RUN npm run webpack

# Rails asset pipeline. Runs here due to Rake having dependencies
# on a ton of files.
# see https://blog.eq8.eu/article/rails-assets-pipeline-and-docker.html for problems with this. Ignoring for now
RUN bundle exec rake assets:precompile

# Run app as appuser
RUN chown -R appuser:appuser /home/appuser/
USER appuser

# Env Vars
ENV CONTAINERIZED=1

EXPOSE 3000
CMD ["bundle", "exec", "rails", "server"]
