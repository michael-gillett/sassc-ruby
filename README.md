# Rails Application Template

### Local development

Run the following commands to setup the local environment:

```
$ bundle install
$ bundle exec rails s
```

Visit the following page in your browser:

```
http://localhost:3000
```

### Running tests

After setting up local development, run the command:

```
$ RAILS_ENV=test bundle exec rake rapleaf:migrate -- --recreate
$ bundle exec rspec
```
