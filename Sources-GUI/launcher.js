  var forever = require('forever-monitor');
  var child = forever.start('serverProduction.js', {
    max : 1,
    silent : true
  });