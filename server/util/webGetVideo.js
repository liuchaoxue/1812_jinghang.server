const  {exec } = require('child_process');
const download = require('download');

let videoPath = './server/data/ted/';

let Video = {};

Video.getTedVideo = function (videoInfo, cb) {
    let url = videoInfo.url;
    let id = videoInfo.id;

    let dist = videoPath + id;
    download(url, dist).then(() => {
        console.log('video is ok');
        cb();
    })
};

module.exports = Video;



