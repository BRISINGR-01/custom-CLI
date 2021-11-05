const fs = require('fs');
const path = require('path');
const mimeTypes = require('./mimeTypes.json');

function serveStatic(folder, url, res, shouldNotTerminate = false) {
	// if you want to serve a certain file do it as serveStaticFiles('public/init.html', url, res)
	const urlPath = url?.path || url
	const basedir = process.env.PWD;
	if (typeof folder !== 'string') throw new TypeError('Folder must be a String');
	if (typeof urlPath !== 'string') throw new TypeError('The second argument of serveStatic must be a string or an object with a path property');

	if (urlPath[0] === folder) urlPath.splice(0, 1);// if the folder duplicates
	const filePath = folder.includes('/') || folder.includes('\\') ? path.resolve(basedir, folder) : path.join(basedir, folder, ...urlPath);
	if (fs.existsSync(filePath)) {
		const extention = path.extname(filePath);
		const contentType = mimeTypes[extention] || 'text/plain';
		const file = fs.readFileSync(filePath).toString();

		res.setHeader('Content-Type', contentType);
		res.write(file);
		res.statusCode = filePath.includes('404') ? 404 : 200;
	} else {
		console.log('File not found');
	}
	return !shouldNotTerminate && res.end();
}

module.exports = serveStatic;