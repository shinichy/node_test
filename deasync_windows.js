'use strict'

var net = require('net');
var port = 8000;
var host = 'localhost';

var server = net.createServer(function(c) {
  c.on('data', function(data) {
    console.log('data on server: ' + data);
    console.log('sending c');
    c.write('c');
  });
	c.on('end', function() {
		server.close()
	});
  c.write('a');
});
server.listen(port, host);

var done = false;
var client = net.createConnection(port, host)
client.on('data', function(data) {
  console.log('data on client: ' + data)
  if (data == 'a') {
    console.log('sending b')
    client.write('b');
    require('deasync').loopWhile(() => !done);
    console.log('done');
		client.end()
  } else if (data == 'c') {
    done = true;
  } else {
    console.log('unknown data:' + data)
  }
});

