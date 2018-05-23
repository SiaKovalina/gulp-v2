var StaticServer = require('static-server');

var server = new StaticServer({
    rootPath: './public/',
    port: 3000
});

server.start(function() {
    console.log('Server started on port ' + server.port);
})

//To start the server, run in terminal 'node server.js' command from the project directory
//With this plugin Chrome Browser is prone to cash all files, so livereload does not work correctly