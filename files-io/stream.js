const fs = require('fs');
const rs= fs.createReadStream('./files/lorem.txt', 'utf8');
const ws = fs.createWriteStream('./files/lorem-copy.txt');

// rs.on('data', (datachunk) => {
//     ws.write(datachunk);
// })

rs.pipe(ws);
