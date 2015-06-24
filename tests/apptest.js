
var http = require("http")
var app = require("../app")


//Test that the Get method will return the correct value. 
//The value of /messages/0 will be "test" at the intialization of the server.
exports.testGet = function(test){
	http.get("http://localhost:3000/messages/0", function(res){
	
		//Handle result error.
		res.on("error", function(e){
			test.ok(false, "Get response encountered error: " + e.message);
			test.done();
		});

		res.on("data", function(data){

			test.equal(data, "test", "Get failed to return the correct value.");
			test.done();
		});

	}).on('error', function(e) {
			test.ok(false, "Get request encountered error: " + e.message);
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
			test.ok(false, "Post response encountered error: " + e.message)
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
					test.equal(data, post_message, "Post method failed to post the message correctly.")
					test.done();
				});

				//Handle result error.
				result.on("error", function(e){
					test.ok(false, "Get response encountered error: " + e.message);
					test.done();
				});

				//Handle request error.
			}).on('error', function(e) {
 				test.ok(false, "Get request encountered error: " + e.message);
 				test.done();
			});

		});
	});

	req.on('error', function(e) {
		test.ok(false, "Post request encountered error: " + e.message);
		test.done();
	});

	req.write(post_message);
	req.end();
}


exports.testDelete = function(test){

	//These options will cause DELETE to be sent to /messages/0
	var options = {
	  hostname: 'localhost',
	  path: '/messages/0',
	  port: '3000',
	  method: 'DELETE',
	};

	//Send the DELETE
	var req = http.request(options, function(res){
		
		res.on("error", function(e){
			test.ok(false, "Delete response encountered error: " + e.message);
			test.done();
		});

	}).on('error', function(e) {
 	 test.ok(false, "Delete request encountered error: " + e.message);
 	 test.done();
	});

	req.end();

	//Send a get request to make sure that the message has been deleted.
	http.get("http://localhost:3000/messages/0", function(res){
		res.on("error", function(e){
			test.ok(false, "Get request encountered error: " + e.message);
			test.done();
		});

		res.on("data", function(data){
			test.equal(res.statusCode, 404, "Get Request did not return a 404 message");
			test.done();
		});
	});


}
