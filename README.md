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

There's a task scheduled to run at regular intervals.  If you'd like to run more, you can spin up worker dynos.  They'll run through the script, finish, and then restart the script indefinitely.  You can spin up as many as you like (keeping in mind this will add load to the production site), although this is intended more for simulating low levels of constant requests and for monitoring, rather than for load testing per se.