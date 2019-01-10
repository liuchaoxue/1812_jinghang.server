var path  = require('path')
console.log();
let config = {
    conn: 'mongodb://localhost/jinghang',
    port: process.env.PORT || 3000,
    host: 'http://localhost:3000',
    filePath: path.resolve('../media/'),
    fileStage: path.resolve('../media/fileStage')
};



module.exports = config;