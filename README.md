# aws-lambda-rest-proxy
A REST proxy for Lambda - work in progress

##To Do
- Add HTTPS capability with certificates
- Add ability to use IAM keys 

## Configuration
The file ```config.json``` contains configuration parameters.  For now, you need to have a ```.aws/credentials``` file available.  TODO: Add IAM keys to config file

## Usage
You can run 'invoke-lambda-from-nodejs.js' file using the below command. 
```
node invoke-lambda-from-nodejs.js
```
