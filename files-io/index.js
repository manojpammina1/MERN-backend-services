const fsPromises = require('fs').promises;
const path = require('path');


const fileOps = async() => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8');
        console.log(data);
        await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt'));

        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you again.');
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'));

        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf8');
        console.log(newData);
    } catch(err) {
        console.error(err);
    }
}

fileOps();

// console.log("Hello...");
//
// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Yo Yoed Honey singhuuu' ,(err, data) => {
//     if(err) throw err;
//     console.log("Write Complete");
//
//     fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n \n Yo Yoed Honey singhuuu12' ,(err, data) => {
//         if(err) throw err;
//         console.log("Append Complete");
//
//         fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files','newReply.txt') ,(err, data) => {
//             if(err) throw err;
//             console.log("Rename Complete");
//         });
//     });
// });



process.on('uncaughtException', err=> {
    console.error(`there was an error: ${err.message}`);
    process.exit(1);
})