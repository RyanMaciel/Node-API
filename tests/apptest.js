
var http = require("http")
var app = require("../app")

exports.testSomething = function(test){
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};


exports.testGet = function(test){
	http.get("localhost:3000/messages/0", function(res){
	
		//Handle result error.
		res.on("error", function(error){
			test.ifError(error);
			test.done();
		});

		res.on("data", function(data){


		});

	}).on('error', function(e) {
			console.log("Got error: " + e.message);
			test.ifError(error);
			test.done();
	});


}

exports.testPost = function(test){

	//Define the options and data for the post.
	var post_message = "Post Test!"

	var options = {
	  hostname: 'localhost',
	  path: '/messages/',
	  port: '3000',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'text/plain',
	    'Content-Length': post_message.length
	  }
	};

	//create the post
	var req = http.request(options, function(res){

		res.setEncoding("utf8");
		post_res = "";


		//Handle error
		res.on("error", function(error){
			console.log("Got error: " + error.message);
			test.ifError(error);
			test.done();
		});

		
		//Handle data
		res.on("data", function(data){

			//collect the data.
			post_res = data;

		});

		//Handle end of res.
		res.on("end", function(){


			//The response is finished. We should have all of our data.
			//We want to make sure that the message was actually posted now. The data from the response should be the index of the message.
			http.get("http://localhost:3000/messages/" + post_res, function(result){
				result.setEncoding("utf8");

				//Handle get data
				result.on("data", function(data){
					test.equal(data, post_message)
					test.done();
				});

				//Handle result error.
				result.on("error", function(error){
					test.ifError(error);
					test.done();
				});

				//Handle request error.
			}).on('error', function(e) {
 				console.log("Got error: " + e.message);
 				test.ifError(error);
 				test.done();
			});

		});
	});

	req.on('error', function(e) {
  test.ifError(error);
  test.done();
	});

	req.write(post_message);
	req.end();
}