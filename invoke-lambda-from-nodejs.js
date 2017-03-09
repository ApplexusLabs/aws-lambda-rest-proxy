/*

*/
var express = require('express');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
var fs = require('fs');
var config = require('./config.json');
var startServer = require('./startServer');

var lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});


//load up swagger file
var swaggerAPIGateway = JSON.parse(fs.readFileSync(config.swaggerFile));

// Clear screen
process.stdout.write('\033c');

//Check if we have a command line argument and load the corresponding swagger JSON file
// if(process.argv[2] === '-f') {
// 	console.log('Reading configuration file \n\t' + process.argv[3]);
// 	swaggerAPIGateway = require(process.argv[3]);
// }
// else {
// 	console.log('Reading DEFAULT configuration file');
// 	swaggerAPIGateway = require('./applexusLabsAuth-prod-swagger-integrations,authorizers,documentation.json');
// }


// Instantiate express web server
var app = express();
if (config.cors == true) {
		var cors = require('cors');
	app.use(cors());
	console.log('CORS enabled');

} else {
	app.use(bodyParser.json());
}


// Helper function - Generic error handler used by all endpoints.
function HandleError(res, reason, message, code) {
	console.log('ERROR: ' + reason);
	res.status(code || 500).json({'error': message});
}

// Helper function to get the protocol
function GetProtocol (req) {
    var proto = req.connection.encrypted ? 'https' : 'http';
    proto = req.headers['x-forwarded-proto'] || proto;
    return proto.split(/\s*,\s*/)[0];
}

// Creates an GET endpoint. 
// api = path, lambdaFn = lambda function name that will be called
function CreateGET(api, lambdaFn) {
	console.log('Creating GET endpoint - ' + api);
	var params = {
		FunctionName : lambdaFn,
		InvocationType : 'RequestResponse',
		//ClientContext : '',
		//Payload : '',
		//Qualifier : '',
		LogType : 'None'
	};
	app.get(api, function(req, res) {
		lambda.invoke(params, function(error, data) {
			if(error) {
				res.status(200).json(error);
			} else {
				res.status(200).json(data.Payload);
			}
		});
	});
}

// Creates an POST endpoint. 
// api = path, lambdaFn = lambda function name that will be called
function CreatePOST(api, lambdaFn) {
	console.log('Creating POST endpoint - ' + api);
	var params = {
		FunctionName : lambdaFn,
		InvocationType : 'RequestResponse',
		//ClientContext : '',
		//Payload : '',
		//Qualifier : '',
		LogType : 'None'
	};
	app.post(api, function(req, res) {
		lambda.invoke(params, function(error, data) {
			if(error) {
				res.status(200).json(errObj);
			} else {
				res.status(200).json(data.Payload);
			}
		});
	});
}

// Parse the swagger definition file and create respective endpoints
for (var key in swaggerAPIGateway.paths) {
	for(var httpMethod in swaggerAPIGateway.paths[key]) {
		var lambdaUri;
		var lambdaFn;
		//console.log(httpMethod);
		switch(httpMethod) {
			case 'get':
				lambdaUri = swaggerAPIGateway.paths[key].get['x-amazon-apigateway-integration'].uri;
				
				// check if it calls a lambda function. Otherwise return error
				if(lambdaUri.indexOf('arn:aws:lambda:') != -1) {
					lambdaFn = lambdaUri.substr(lambdaUri.indexOf('arn:aws:lambda:')).replace('/invocations', '');

					CreateGET(key, lambdaFn);
				} else {
					console.log('API Gateway for GET does not call lambda function..');
				}
				break;
			case 'post':
				lambdaUri = swaggerAPIGateway.paths[key].post['x-amazon-apigateway-integration'].uri;
				// check if it calls a lambda function. Otherwise return error
				if(lambdaUri.indexOf('arn:aws:lambda:') != -1) {
					lambdaFn = lambdaUri.substr(lambdaUri.indexOf('arn:aws:lambda:')).replace('/invocations', '');

					CreatePOST(key, lambdaFn);
				} else {
					console.log('API Gateway for POST does not call lambda function..');
				}
				break;
			default:
				break;
		}
		//console.log(httpMethod);
	}
	//console.log(key + ' = ' + lambdaFn);
}

// Start the web server on a port

var server = startServer.create(config ,app , function(){
	var host = 'localhost'; //server.address().address
	var port = server.address().port

	console.log('\nWebserver listening at http://%s:%s', host, port)
})

