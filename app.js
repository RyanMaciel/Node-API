var express = require('express');
var app = express();

var messages = ["test", "hi!", "test"];

app.get('/messages/:id', function (req, res) {
  var id = req.params.id;
  console.log(id)
  if(messages[id] != null && messages[id] != null){
    res.send(200, messages[id]);
  }else{

    res.send(404, "message not found :(");
  }
});


//Handle a new message post.
app.post('/messages/', function (req, res){
  req.setEncoding("utf8");
  req.on("data", function(data){
    
    //Create a post with the data
    messages.push(data);
    res.send(201, (messages.length-1).toString());

  });
});


//Handle the deletion of a message.
app.delete("/messages/:id", function (req, res){
  var id = req.params.id

  if(id != null){
    messages[id] = null;
    res.send(204);
  }else{
    res.send(400, "Bad request :(");
  }

});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

module.exports = app;