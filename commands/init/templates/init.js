const http = require('http');
const fs = require('fs');
const path = require('path');
const { serveStatic, requestDecoder } = require('./helpers');
const { localTesting, localPort, landingPage } = require('./package.json');


const baseUrl = typeof process.env.PORT === 'number' ? `http://localhost:${process.env.PORT}` : process.env.PORT || localTesting;

function routes(req, res) {
	res.setHeader('Access-Control-Allow-Origin' , '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');

	const request = requestDecoder(req, baseUrl);

	if (!request.lastVal) serveStatic(landingPage, request, res);
	serveStatic('public', request, res, true);

	
	serveStatic('public/404.html', request, res);
}

const server = http.createServer(routes);
server.listen(process.env.PORT || localPort);
