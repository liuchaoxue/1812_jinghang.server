const  {exec } = require('child_process');

let audioPath = './server/data/bbc/';

let Audio = {};

Audio.getTedAudio = function (audioInfo, cb) {
    let url = audioInfo.url;
    let id = audioInfo.id;

    let dist = audioPath + id;

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

module.exports = Audio;
