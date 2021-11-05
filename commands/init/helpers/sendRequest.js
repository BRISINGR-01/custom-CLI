const http = require('http');
const https = require('https');
const path = require('path');
const mimeTypes = require('./mimeTypes.json')

function sendRequest(opt, url, req, res, data) {
	const options = {
		hostname: url.host,
		path: url.pathname,
		port: url.port,
		method: opt.method || 'GET',
		...opt
	}
	let protocol = url.protocol === 'https' ? https : http;
	const httpReq = protocol.request(options, httpRes => {
		let body = [];
		httpRes.on('data', chunk => body.push(chunk.toString()));
		httpRes.on('end', () => {
			console.log(body);
			const extention = path.extname(body);
			let contentType = mimeTypes[extention] || 'text/plain';
			if (!extention) {
				if (body.slice(0,10).some(el => el.includes('<'))) contentType = 'text/html';
				try {
					if (typeof JSON.parse(body) === 'object') contentType = 'application/json'
				} catch (err) {console.log(err)}
			}
			res.setHeader('Content-Type', `${contentType};charset=utf-8`);

			res.write(Object.values(body).join(''));
			return res.end();
	  });
	  req.on('error', console.log);
	  process.on('uncaughtException', console.log);
	});
}

module.exports = sendRequest