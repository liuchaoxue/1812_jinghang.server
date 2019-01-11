var path  = require('path');
let config = {
    conn: 'mongodb://localhost/jinghang_dev',
    port: process.env.PORT || 4000,
    host: 'http://cms.jinghangapps.com',
    filePath: path.resolve('../media/'),
    fileStage: path.resolve('../media/fileStage'),
    secretId : "AKIDTTl8Y3XF3EKHFKroJ8Y5h1Sxdp5P7Z7b",
    secretKey: "pCUefYKzXvmYM9sX3TlMpCTekiYEFC4t"
};



module.exports = config;