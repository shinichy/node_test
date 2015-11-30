'use strict'

var net = require('net');
var path = '/tmp/deasync.sock';
var msgpack = require('msgpack');

var server = net.createServer(function(c) {
  c.on('data', function() {
    c.write(msgpack.pack('foo'));
  });
	c.on('end', function() {
		console.log('end')
		server.close()
	})
  c.write(msgpack.pack('hello'));
});
server.listen(path);

var done = false;
var client = net.createConnection(path)
var stream = new msgpack.Stream(client)
stream.on('msg', function(msg) {
  console.log('msg: ' + msg)
  if (msg === 'hello') {
    client.write(msgpack.pack('foo'));
    require('deasync').loopWhile(() => !done);
    console.log('done');
		client.end()
  } else if (msg === 'foo') {
    done = true;
  }
});
