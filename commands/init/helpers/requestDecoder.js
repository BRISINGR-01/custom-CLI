const queryDecoder = require('./queryDecoder')

function requestDecoder(req, thisUrl) {
	const UrlObject = new URL(req.url, thisUrl);
	let path = UrlObject.href.replace(`${UrlObject.origin}/`, '').split('/');
	let lastVal = path[path.length - 1];
	let query = queryDecoder(lastVal);
	return {
		path,								// Array
		lastVal,							// Array
		query,								// Object
		origin: UrlObject.origin,			// String
		host: UrlObject.host,				// String
		pathname: path.join('/'),			// String
		port: UrlObject.port,				// String || Number
		protocol: UrlObject.protocol,		// String
	}
}

//							URL()

// 				 | host/hostname |
//			https://www.youtube.com/watchsmth?v=1321313  (port='')
//			 http://localhost:3000/some_path?key=value
//     |protocol|hostname |port|pathname|  search  |
// 	 |  		 |		 host	    |	  		  			 	|
//		 |  		origin   		 |   		  			 	|
//		 |  							href 	     		 		|

module.exports = requestDecoder;