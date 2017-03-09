# aws-lambda-rest-proxy
A REST proxy for Lambda - work in progress

The purpose of this project is to create a simply proxy for invoking Lambda routines via REST without using API Gateway.  Presently, API Gateway does not provide VPC endpoints and you must expose the API Gateway to the raw internet.  For some scenarios, this is not desired--such as when someone wants to invoke their Lambda routines via REST completely within the protection of a VPC.

VPC endpoints for API Gateway are on the roadmap, but until then, this method might be a viable alternative.

##To Do
- Add HTTPS capability with certificates
- Add ability to use IAM keys
- Containerize this guy

## Configuration
The file ```config.json``` contains configuration parameters.  For now, you need to have a ```.aws/credentials``` file available.  TODO: Add IAM keys to config file

## Usage
You can run 'invoke-lambda-from-nodejs.js' file using the below command. 
```
node invoke-lambda-from-nodejs.js
```

## Example Architecture
For mission critical apps, I would suggest creating an autoscale group minimum of 2 across AZ's, front-ended by ELB.  These can be very tiny systems like a t2.micro since they aren't really doing much other than calling the Lambda routine directly.  If the payloads are large, then you might want to pay attention to memory utilization.

I would also recommend giving the EC2 instance an IAM role rather than hardcoding IAM Keys into the config file.

![/img/LambdaProxy.png]
