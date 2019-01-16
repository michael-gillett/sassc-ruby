FROM phusion/passenger-ruby23

# Enable nginx/passenger. These files will never change, so we can do these
# steps early without worrying about cache-busting.
RUN rm -f /etc/service/nginx/down
RUN rm /etc/nginx/sites-enabled/default

# Install yarn
RUN apt-get update \
  && curl -sL https://deb.nodesource.com/setup_9.x | bash && apt-get install -y nodejs \
  && npm i -g webpack

# Switch to app user because passenger runs as app. This, combined with --chown
# on COPY commands, ensures all application files are read/writable by the app.
USER app:app
ENV CODE_PATH=/home/app/webapp RAILS_LOG_TO_STDOUT=1
RUN mkdir $CODE_PATH && chown app:app $CODE_PATH
WORKDIR $CODE_PATH

# Install npm packages. This is done before installing gems because this app
# experiences more churn in gem versions than it does for npm package versions.
# Operating on files with the least amount of churn first reduces cache misses
# when building the image.
COPY --chown=app:app package.json package-lock.json .npmrc ./
RUN npm run install:packages

# Install gems. These gems must be packaged outside of the container, which
# eliminates the need to copy an SSH key into the container so it can pull
# git gems.
COPY --chown=app:app Gemfile Gemfile.lock ./
COPY --chown=app:app vendor vendor
RUN bundle install --deployment --jobs 30 \
  && bundle clean

# Webpack bundle compilation. Doing this after gem installation to optimize
# build speed for local development. This app also has a fast webpack
# compilation time.
COPY --chown=app:app webpack.config.js ./
COPY --chown=app:app app app
RUN npm run webpack

# Copy everything else the application needs. These steps are cheap, so doing
# them after the expensive steps allows us to tweak them without invalidating
# the cache of the expensive steps like gem installation.
COPY --chown=app:app config config
COPY --chown=app:app lib lib
COPY --chown=app:app bin bin
COPY --chown=app:app db db
COPY --chown=app:app public public
COPY --chown=app:app Rakefile ./
COPY --chown=app:app config.ru ./

# Rails asset pipeline. Runs here due to Rake having dependencies
# on a ton of files.
# see https://blog.eq8.eu/article/rails-assets-pipeline-and-docker.html for problems with this. Ignoring for now
RUN RAILS_ENV=production bundle exec rake assets:precompile

# Copy the nginx and passenger configs. Doing them last so we can change them
# without busting the cache for the more expensive steps.
COPY --chown=app:app config/docker/webapp.conf /etc/nginx/sites-enabled/webapp.conf
COPY --chown=app:app config/docker/rails-env.conf /etc/nginx/main.d/rails-env.conf

EXPOSE 8080

# Switch back to root user because the parent image won't work otherwise
USER root:root
