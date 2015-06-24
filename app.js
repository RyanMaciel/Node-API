var express = require('express');
var app = express();

var messages = ["test", "hi!", "test"];

function haversine(lat1, long1, lat2, long2){
  var dlat = lat2 - lat1;
  var dlong = long2 - long1;

  var R = 3961; //approx radius of the world in miles

  var a = Math.pow((Math.sin(dlat/2)), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((Math.sin(dlong/2)), 2);
  var c = 2 * Math.atan2(Math.pow(a, 0.5), Math.pow((1-a), 0.5));
  var d = R * c;

  return d;
}

//implement a haversine function
app.get("/distances/", function(req, res){
  var d = haversine(parseFloat(req.query.lat1), parseFloat(req.query.long1), parseFloat(req.query.lat2), parseFloat(req.query.long2));
  res.send(200, d.toString());

});

app.get("/messages/index", function (req, res){
  //output a comma-delimeted list of messages.

  var returnString = ""
  for(var i = 0; i < messages.length; i++){
    if(i = messages.length-1){
      returnString += messages[i];
      break;
    }
    returnString += (messages[i] + ",");

  }
  res.send(200, returnString);

});

app.get("/messages/:id", function (req, res) {

  if(idValid(req.params.id)){
    res.send(200, messages[req.params.id]);
  }else{

    res.send(404, "message not found :(");
  }
});


//Handle a new message post.
app.post("/messages/", function (req, res){
  req.setEncoding("utf8");
  req.on("data", function(data){
    
    //Create a post with the data
    messages.push(data);
    res.send(201, (messages.length-1).toString());

  });
});


//Handle the deletion of a message.
app.delete("/messages/:id", function (req, res){

  if(idValid(req.params.id)){
    messages[req.params.id] = null;
    res.send(204);
  }else{
     res.send(404, "message not found :(");
  }

});

app.put("/messages/:id", function (req, res){
  if(idValid(req.params.id)){

    req.setEncoding("utf8");
    req.on("data", function(data){
      messages[req.params.id];

    })

  }else{
     res.send(404, "message not found :(");

  }

});

function idValid(id){
  if(id != null && messages[id] != null){
    return true;
  }
  return false;
}

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

module.exports = app;