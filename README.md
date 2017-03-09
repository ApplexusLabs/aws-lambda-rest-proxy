# aws-lambda-rest-proxy
A REST proxy for Lambda - work in progress

##To Do
- Add HTTPS capability with certificates
- Add CORS capabilities

## Usage
You can run 'invoke-lambda-from-nodejs.js' file using the below command. It takes an optional command line argument -f <the swagger API definition JSON file>. 
```
node invoke-lambda-from-nodejs.js
```
```
node invoke-lambda-from-nodejs.js -f './swagger-export-filename.json'
```
