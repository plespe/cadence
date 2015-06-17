var utils = require('./utils');
var fs = require('fs');
var storage = [];
var StanfordNLP = require("./stanford-nlp-wrapper.js");


var requestHandler = function(request, response) {

// ==========  ORIGINAL CODE =======
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode = 200;
  var headers = utils.headers;

  if (request.method === "GET") {

    if (request.url === "/") {
      fs.readFile('../client/index.html',function (err, data) {
        response.writeHead(statusCode, {'Content-Type': 'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
      });
    }

    else if (request.url === "/styles/styles.css") {
     fs.readFile('../client/styles/styles.css', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/css','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/node_modules/underscore/underscore-min.js") {
     fs.readFile('../node_modules/underscore/underscore-min.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/node_modules/jquery/dist/jquery.min.js") {
     fs.readFile('../node_modules/jquery/dist/jquery.min.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/node_modules/backbone/backbone-min.js") {
     fs.readFile('../node_modules/backbone/backbone-min.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/app.js") {
     fs.readFile('../client/app.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }


    else {
      utils.sendResponse(response, "Not Found", 404);
    }

  } else if (request.method === "POST") {
      if (request.url === "/text") {
        statusCode = 201;
        var requestBody = "";

        request.on("data", function(data){
          requestBody += data;
        });

        request.on('end', function(){
          console.log(requestBody);
          var parser = new StanfordNLP(function(err){
            if (err) console.log(err);
            console.log("about to start processing");
            parser.process(requestBody, function(err, data){
              if (err) console.log(err);
              console.log("finished processing");
              response.writeHead(statusCode, utils.headers);
              response.write(JSON.stringify(data));
              response.end();
            });
          });
        });
    } else {
      utils.sendResponse(response, "Not Found", 500);
    }  
  }
};

module.exports = requestHandler;
  

      // storage = [];
      // storage.push(formData);

      // console.log("end of Post, storage is: " + storage);
      // response.end(statusCode);





// var objectId = 1;
// var messages = [
//   // Useful for debugging
//   // {
//   //   text: 'hello world',
//   //   username: 'fred',
//   //   objectId: objectId
//   // }
// ];

// var actions = {
//   'GET': function(request, response){
//     utils.sendResponse(response, {results: messages});
//   },
//   'POST': function(request, response){
//     utils.collectData(request, function(message){
//       message.objectId = ++objectId;
//       messages.push(message);
//       utils.sendResponse(response, {objectId: objectId}, 201);
//     });
//   },
//   'OPTIONS': function(request, response){
//     utils.sendResponse(response);
//   }
// };

// exports.requestHandler = function(request, response) {
//   var action = actions[request.method];
//   if( action ){
//     action(request, response);
//   } else {
//     utils.sendResponse(response, "Not Found", 404);
//   }
// };