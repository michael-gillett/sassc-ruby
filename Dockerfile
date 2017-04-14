FROM ruby:alpine

RUN apk --update add --virtual build-dependencies build-base ruby-dev openssl-dev libxml2-dev libxslt-dev \
    libc-dev linux-headers tzdata nodejs && gem install bundler

ADD Gemfile /app/
ADD Gemfile.lock /app/

RUN cd /app ; bundle config build.nokogiri --use-system-libraries && bundle install --without development test

ADD . /app
RUN chown -R nobody:nogroup /app
USER nobody

ENV RAILS_ENV production
WORKDIR /app

CMD ["bundle", "exec", "rails", "s", "-p", "8080"]
