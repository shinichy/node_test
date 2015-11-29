'use strict'

var net = require('net');
var deasync = require('deasync');
var path = '/tmp/deasync.sock';
var cp = require('child_process');
var util = require('util')
var events = require('events')
var msgpack = require('msgpack');

var server = net.createServer(function(c) { //'connection' listener
  console.log('client connected');
  c.on('data', function() {
    console.log('data on Server')
    c.write(msgpack.pack('hello2\r\n'));
  });
  c.on('end', function() {
    console.log('client disconnected');
  });
  c.write(msgpack.pack('hello\r\n'));
  c.pipe(c);
});
server.listen(path, function() { //'listening' listener
  console.log('server bound');
});

var Stream = function() {
	var self = this
	events.EventEmitter.call(self)

  var client = net.createConnection(path,
      function() { //'connect' listener
    console.log('connected to server!');
    // client.write('world!\r\n');
  });
	self.client = client
  client.on('data', function(data) {
		self.emit('data', data)
  });
  client.on('end', function() {
		self.emit('end')
  });

}

Stream.prototype.sendAsync = function(cb) {
  this.client.write(msgpack.pack('hoge\r\n'));
}

util.inherits(Stream, events.EventEmitter)

var stream = new Stream()
var done = false;
stream.addListener('data', function(data) {
      console.log('data on Client')
			var response = msgpack.unpack(data)
      if (response.toString().startsWith('hello')) {
        console.log('sendAsync')
        stream.sendAsync()
        require('deasync').loopWhile(() => !done);
        // done is printed last, as supposed, with cp.exec wrapped in deasync; first without.
        console.log('done');

        console.log(data.toString());
        //client.end();
      } else if (response.toString().startsWith('hello2')) {
          console.log('finished!')
          done = true;
      } else {
        console.log('unknown data:' + data)
      }

})
stream.on('end', function(){
    console.log('disconnected from server');
})
