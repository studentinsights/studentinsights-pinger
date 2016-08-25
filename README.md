# Student Insights pinger

### Local setup
Install Docker and Compose.

```
$ docker-compose build pinger
$ docker-compose run pinger
```

You'll see an error about environment variables not being set.  These are credentials to the production site, so you need to talk to someone to get them.  Pass each variable to `docker-compose` with `-e` like this:

```
$ docker-compose run -e FOO=bar -e SECRET=blah pinger
```

### Heroku setup
This uses https://github.com/stomita/heroku-buildpack-phantomjs to provide the PhantomJS binary.