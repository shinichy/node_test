'use strict'

var net = require('net');
var deasync = require('deasync');
var path = '/tmp/deasync.sock';
var cp = require('child_process');
var util = require('util')
var events = require('events')
var Reflect = require('harmony-reflect')
var rpc = require('silk-msgpack-rpc');

var handler = {
	  'add' : function(a, b, response) {
			     response.result( a + b );

		}

}

var server = rpc.createServer();
server.setHandler(handler);
server.listen(path);

function Client() {
  var c = rpc.createClient(path)
	this.c = c
}

Client.prototype.add = function(a, b) {
	var done = false
  var result;
	this.c.invoke('add', a, b, function(err, response) {
		done = true
		result = response
	})
	deasync.loopWhile(() => !done)
	return result
}

var client = new Client()
var result = client.add(4, 5)
console.log(result)
var result = client.add(1, 2)
console.log(result)

/*
var server = net.createServer(function(c) { //'connection' listener
  console.log('client connected');
  c.on('data', function() {
    console.log('data on Server')
    c.write('hello2\r\n');
  });
  c.on('end', function() {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
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
  this.client.write('hoge\r\n');
}

util.inherits(Stream, events.EventEmitter)

var stream = new Stream()
var done = false;
stream.addListener('data', function(data) {
      console.log('data on Client')
      if (data == 'hello\r\n') {
        console.log('sendAsync')
        stream.sendAsync()
        require('deasync').loopWhile(() => !done);
        // done is printed last, as supposed, with cp.exec wrapped in deasync; first without.
        console.log('done');

        console.log(data.toString());
        //client.end();
      } else if (data.toString().startsWith('hello2')) {
          console.log('finished!')
          done = true;
      } else {
        console.log('unknown data:' + data)
      }

})
stream.on('end', function(){
    console.log('disconnected from server');
})
*/
