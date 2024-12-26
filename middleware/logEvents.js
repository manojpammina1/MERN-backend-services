const {format} = require('date-fns');
const {v4: uuid} = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd \t HH:mm:ss')}`;
    const logItem = `${dateTime} \t ${uuid()}\t${message}\n`;
    console.log(logItem);
    try{
        if(!fs.existsSync(path.join(__dirname, '..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..', 'logs'), { recursive: true });

        }
        await fsPromises.appendFile(path.join(__dirname, '..','logs', logName), logItem);
    } catch (err) {
        console.error(err);
    }
}

const logger = (req,res,next) => {
    logEvents(`Request Method: ${req.method} \t ${req.headers.origin}\t${req.url}`, 'reqLog.log');
    console.log(`Request Method: ${req.method} ${req.path}`);
    next();
}

module.exports = {logger, logEvents};