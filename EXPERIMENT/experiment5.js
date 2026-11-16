
const http = require('http');

const DEFAULT_PORT = 3000;
let data = 'Hello World';

const startServer = (port) => {
    const server = http.createServer((req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        console.log(`Request received: ${req.method} ${pathname}`);

        res.setHeader('Content-Type', 'text/plain');

        // ROOT ROUTE
        if (req.method === 'GET' && pathname === '/') {
            res.statusCode = 200;
            res.end('Welcome to my server');
        }

        // GET ROUTE
        else if (req.method === 'GET' && pathname === '/data') {
            res.statusCode = 200;
            res.end(data);
        }

        // POST ROUTE
        else if (req.method === 'POST' && pathname === '/data') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                data = body || 'empty request body';
                res.statusCode = 201;
                res.end('Data created: ' + data);
            });
        }

        // PUT ROUTE
        else if (req.method === 'PUT' && pathname === '/data') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                data = body || 'empty request body';
                res.statusCode = 200;
                res.end('Data updated: ' + data);
            });
        }

        // DELETE ROUTE
        else if (req.method === 'DELETE' && pathname === '/data') {
            data = '';
            res.statusCode = 200;
            res.end('Data deleted');
        }

        // NOT FOUND
        else {
            res.statusCode = 404;
            res.end('Route not found');
        }
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            console.log(`Port ${port} is busy. Trying ${nextPort} instead.`);
            startServer(nextPort);
            return;
        }

        console.error('Server error:', err);
    });

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
};

startServer(process.env.PORT || DEFAULT_PORT);
