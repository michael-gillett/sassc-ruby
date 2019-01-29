ARG PARENT_IMAGE=local-registry/go-links:latest
FROM $PARENT_IMAGE
ENV RAILS_ENV=test
RUN bundle install --deployment --with test
CMD ["bundle", "exec", "rake", "app:test"]
COPY --chown=appuser:appuser .rspec ./
COPY --chown=appuser:appuser db db
COPY --chown=appuser:appuser spec spec
