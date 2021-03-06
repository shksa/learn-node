const http = require('http');
const through2Map = require('through2-map');
const httpShutdown = require('http-shutdown'); // Required to gracefully shutdown the server after the first response

let toUpperMapper = through2Map(reqBody => reqBody.toString().toUpperCase());
let serverObject = null;

// Server shut down helper function
// Arguments: Server object
// Returns: null
// Output: Prints status to console
let stopHTTPServer = () => {
  serverObject.shutdown(() => {
    console.log('Everything is cleanly shutdown.');
  });
};

let startNodeServer = (port) => {
  let server = http.createServer((request, response) => {
    if (request.method === 'POST') {
      // Process body and pipe it to response
      return request.pipe(toUpperMapper).pipe(response);
    }
    return response.end('Not a valid POST request\n');
  });
  server = (httpShutdown)(server);
  serverObject = server;
  server.listen(port);
};

// startNodeServer(process.argv[2]);
module.exports = { startNodeServer, stopHTTPServer };
