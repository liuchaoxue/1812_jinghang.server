const  {exec } = require('child_process');

let videoPath = './public/data/ted/';

let Video = {};

Video.getTedVideo = function (videoInfo, cb) {
    let url = videoInfo.url;
    let id = videoInfo.id;

    let dist = videoPath + id;

    let cmd = 'you-get -o '+ dist + ' '+ url;
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        console.log('out: '+stdout);
        console.log('err: '+stderr);
        console.log('ok');
        cb();
    });
};

module.exports = Video;



