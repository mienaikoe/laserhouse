import { createServer } from 'http';
import File from 'fs';
import path from 'path';
import url from 'url';

const PORT = 3000;

const HTML_FILE = 'index.html';
const HTML_CONTENT = File.readFileSync(HTML_FILE, 'utf8');

const server = createServer((req, res) => {
	try{
		if( req.url === '/' || req.url === `/${HTML_FILE}` ) {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(HTML_CONTENT);
		} else {
			const urlParts = url.parse(req.url);
			const filePath = `.${urlParts.pathname}`;
			File.readFile(filePath, "UTF-8", (err, data) => {
				if (err) {
					res.writeHead(404, { 'Content-Type': 'text/plain' });
					res.end('404 Not Found');
				} else {
					res.writeHead(200, { 'Content-Type': 'text/javascript' });
					res.end(data);
				}
			});
		}
	} catch (error) {
		console.error('Error handling request:', error);
		res.writeHead(500, { 'Content-Type': 'text/plain' });
		res.end('500 Internal Server Error');
	}
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});