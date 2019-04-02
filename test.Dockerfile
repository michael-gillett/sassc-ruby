ARG PARENT_IMAGE=local-registry/go-links:latest
FROM $PARENT_IMAGE
ENV RAILS_ENV=test
RUN bundle install --deployment --with test
COPY --chown=appuser:appuser .rspec ./
COPY --chown=appuser:appuser spec spec

CMD ["echo"]

