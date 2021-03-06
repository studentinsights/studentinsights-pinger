/*
This script takes environment variables for USERNAME and PASSWORD and
pings various Student Insights pages.  It will fail if there are errors on the
server in serving these pages, or JS bugs that prevent rendering from occurring.

The intent is to use this to get consistent low levels of traffic to measure the
variability in response times.
*/


// Casper configuration
var TIMEOUT = 60000;
var casper = require('casper').create({
  logLevel: 'info',
  verbose: true,
  exitOnError: true,
  onDie: function(c, message, status) { c.echo('Died:', message, status); },
  onError: function(c, message, status) { c.echo('Error:', message, status); },
  stepTimeout: TIMEOUT,
  waitTimeout: TIMEOUT
});


// App configuration
var env = require('system').env
if (!env.USERNAME || !env.PASSWORD) {
  casper.echo('Missing environment variables: BASE_URL, USERNAME, PASSWORD.');
  casper.exit(1);
}
var config = {
  baseUrl: env.BASE_URL_HTTPS,
  username: env.USERNAME,
  password: env.PASSWORD,
  studentIds: env.STUDENT_IDS.split(','),
  homeroomIds: env.HOMEROOM_IDS.split(','),
  schoolPaths: env.SCHOOL_PATHS.split(',')
};


// Sign in
casper.start(config.baseUrl + '/', function() {
  this.echo('Signing in to ' + config.baseUrl + '...');
  this.fill('form', {
    'educator[email]': config.username,
    'educator[password]': config.password
  }, true);

  casper.waitForSelector('.SlicePanels', function() {
    this.echo('Signed in.');
  }, TIMEOUT);
});


// Ping all schools
config.schoolPaths.forEach(function(path) {
  var url = config.baseUrl + path;
  casper.thenOpen(url, function() {
    console.log('Opened: ', url);
    casper.waitForSelector('.sliceButtons', function() {
      this.echo(url + '  ' + this.fetchText('.sliceButtons > div'));
    }, TIMEOUT);
  });
});

// Ping sample homerooms
config.homeroomIds.forEach(function(homeroomId) {
  var url = config.baseUrl + '/homerooms/' + homeroomId;
  casper.thenOpen(url, function() {
    console.log('Opened: ', url);
    casper.waitForSelector('h1', function() {
      this.echo(url + '  ' + this.fetchText('h1'));
    }, TIMEOUT);
  });
});


// Ping sample students
config.studentIds.forEach(function(studentId) {
  var url = config.baseUrl + '/students/' + studentId;
  casper.thenOpen(url, function() {
    console.log('Opened: ', url);
    casper.waitForSelector('.homeroom-link', function() {
      this.echo(url + '  ' + this.fetchText('.homeroom-link'));
    }, TIMEOUT);
  });
});


casper.then(function() {
  this.echo('Done.');
});

casper.run();
