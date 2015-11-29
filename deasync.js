'use strict'

var net = require('net');
var path = '/tmp/deasync.sock';
var msgpack = require('msgpack');

var server = net.createServer(function(c) {
  c.on('data', function() {
    c.write(msgpack.pack('hello2\r\n'));
  });
  c.write(msgpack.pack('hello\r\n'));
});
server.listen(path);

var done = false;
var client = net.createConnection(path)
client.on('data', function(data) {
  console.log('data in client')
	var response = msgpack.unpack(data)
  if (response.toString().startsWith('hello')) {
    client.write(msgpack.pack('hoge\r\n'));
    require('deasync').loopWhile(() => !done);
    console.log('done');

    console.log(data.toString());
  } else if (response.toString().startsWith('hello2')) {
      console.log('finished!')
      done = true;
  } else {
    console.log('unknown data:' + data)
  }
});
