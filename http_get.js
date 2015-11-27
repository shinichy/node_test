var https = require('https')

https.get("https://raw.githubusercontent.com/silkedit/packages/master/packages.json", function(res) {
  var body = '';
  res.setEncoding('utf8');
 
  res.on('data', function(chunk){
    body += chunk;
  });
 
  res.on('end', function(res){
    console.log(body)
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});