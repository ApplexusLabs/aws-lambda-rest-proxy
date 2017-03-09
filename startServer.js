var fs = require('fs');

function setup (config) {
   if (config.https == true) {
      return {
         key  : fs.readFileSync(config.key),
         cert : fs.readFileSync(config.cert)
      };
   }
}

function start (app, options) {
   if (options)
      return require('https').createServer(options, app);

   return require('http').createServer(app);
}

module.exports = {
   create: function (config, app, cb) {
      var options = setup(config);
      return start(app, options).listen(config.port, cb);
   }
};