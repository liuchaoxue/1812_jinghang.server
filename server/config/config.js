var path  = require('path')
let config = {
    conn: 'mongodb://localhost/jinghang_dev',
    port: process.env.PORT || 4000,
    host: 'http://cms.jinghang.com',
    filePath: path.resolve('../media/'),
    fileStage: path.resolve('../media/fileStage')
};



module.exports = config;