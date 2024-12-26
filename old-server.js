const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const logEvents = require('./middleware/logEvents');
const EventEmitter = require('events');

class Emitter extends EventEmitter { }
const myEmitter = new Emitter();
myEmitter.on('log',(msg, fileName)=> {
    logEvents(msg, fileName);
});

const PORT = process.env.PORT || 3500;
const serverFile = async(filePath, contentType, res) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8': ''
        );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        res.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType });
        res.end(
            contentType === 'application/json'
                ? JSON.stringify(data)
                : data
        );
    } catch (err) {
        console.error(err);
        myEmitter.emit('log', `${err.name}:  ${err.message}`,'errorLog.txt');
        res.statusCode = 500;
        res.end(`Server Error: ${err}`);
    }
}


const oldServer = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url} \t ${req.method}`,'reqLog.txt');
    const extension = path.extname(req.url);

    let contentType ;

    switch (extension) {
        case '.txt':
            contentType = 'text/plain';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'public', req.url, 'index.html')
            : contentType === 'text/html'
                ? path.join(__dirname, 'views', req.url)
                : path.join(__dirname, req.url);


    if(!extension && req.url.slice(-1) !== '/') {
        filePath += '.html';
    }

    const fileExists = fs.existsSync(filePath);
    if(fileExists) {
        serverFile(filePath, contentType, res);
    } else {
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                serverFile(path.join(__dirname, 'views', '404.html'),'text/html',res);
        }
    }
});




oldServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

