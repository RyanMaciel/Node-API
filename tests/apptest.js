
var http = require("http")
var app = require("../app")


function addErrHandler(test, object, message){
	object.on("error", function(e){
		test.ok(false, message + ": " + e.message);
		test.done();
	});
}

//Test that the Get method will return the correct value. 
//The value of /messages/0 will be "test" at the intialization of the server.
exports.testGet = function(test){
	var req = http.get("http://localhost:3000/messages/0", function(res){
	

		//Handle result error.
		addErrHandler(test, res, "Get response encountered error");

		res.on("data", function(data){

			test.equal(data, "test", "Get failed to return the correct value.");
			test.done();
		});

	});

	addErrHandler(test, req, "Get request encountered error");
}

exports.testPost = function(test){

	//Define the options and data for the post.
	var postMessage = "Post Test!"

	var options = {
	  hostname: 'localhost',
	  path: '/messages/',
	  port: '3000',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'text/plain',
	    'Content-Length': postMessage.length
	  }
	};

	//create the post
	var req = http.request(options, function(res){

		res.setEncoding("utf8");
		postRes = "";


		//Handle error
		addErrHandler(test, res, "Post response encountered error");

		//Handle data
		res.on("data", function(data){

			//collect the data.
			postRes = data;

		});

		//Handle end of res.
		res.on("end", function(){


			//The response is finished. We should have all of our data.
			//We want to make sure that the message was actually posted now. The data from the response should be the index of the message.
			var request = http.get("http://localhost:3000/messages/" + postRes, function(result){
				result.setEncoding("utf8");

				//Handle get data
				result.on("data", function(data){
					test.equal(data, postMessage, "Post method failed to post the message correctly.")
					test.done();
				});

				//Handle result error.
				addErrHandler(test, result, "Get response encountered error");
				
			});

			//Handle request error.
			addErrHandler(test, request, "Get request encountered error");

		});
	});

	//Hand post request error.
	addErrHandler(test, req, "Post request encountered error");

	req.write(postMessage);
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
		
	addErrHandler(test, res, "Delete response encountered error");


	})

	addErrHandler(test, req, "Delete request encountered error");

	req.end();

	//Send a get request to make sure that the message has been deleted.
	http.get("http://localhost:3000/messages/0", function(res){
		
		addErrHandler(test, res, "Get request encountered error");

		res.on("data", function(data){
			test.equal(res.statusCode, 404, "Get Request did not return a 404 message");
			test.done();
		});
	});


}

exports.testUpdate = function(test){

	//These options will cause PUT to be sent to /messages/1

	var putMessage = "PUT Test :D";

	var options = {
	  hostname: 'localhost',
	  path: '/messages/1',
	  port: '3000',
	  method: 'PUT',
	  headers: {
	    'Content-Type': 'text/plain',
	    'Content-Length': putMessage.length
	  }
	};

	var req = http.request(options, function(res){
		addErrHandler(test, res, "PUT response encountered error");

		res.on("data", function(data){

			//Test the put response.
			test.equal(res.statusCode, 200, "PUT request did not return a 200 message");
			test.equal(data, putMessage, "PUT request did not echo the put message");
		});
	});

	req.write(putMessage);
	req.end();
	//Handle req error.
	addErrHandler(test, req, "PUT request encountered error");


	//Make sure that the PUT actually changed a message.
	var get = http.get("http://localhost:3000/messages/1", function(res){

		res.setEncoding("utf8");
		addErrHandler(test, res, "Get result encountered error");

		res.on("data", function(data){
			//test.equal(data, putMessage, "Put did not change message correct.");
			test.done();

		});

	});

	addErrHandler(test, get, "Get request encountered error");

}

//Test the message index. This only tests for existance. A more detailed test might be needed.
exports.testIndex = function(test){
	var get = http.get("http://localhost:3000/messages/index", function(res){

		addErrHandler(test, res, "Get response encountered error");

		res.on("data", function(data){
			test.ok(data, "Index Data returned false");
			test.equal(res.statusCode, 200, "Response did not return 200 status code");
			test.done();
		});

	});

	addErrHandler(test, get, "Get request encountered error");

}
