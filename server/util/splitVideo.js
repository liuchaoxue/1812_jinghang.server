
var fs = require('fs');
var path = require('path')
var ffmpeg = require('fluent-ffmpeg');

function splitVideo(originPath, outPath, startTime, duration, type){

    let filePath = path.join(outPath, '../')
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    return new Promise((resolve, reject) => {
        console.log('========================')
        ffmpeg(originPath)
            .setStartTime(startTime)
            .setDuration(duration)
            .output(outPath+'.'+type)
            .on('end', function (err) {
                if (err) {
                    console.log(err)
                  return  reject()
                }
                fs.rename(outPath+'.'+type, outPath,function(err, data){
                    console.log(err)
                    console.log(err)
                    if(err) return reject()
                    resolve()
                })


            })
            .on('error', function (err) {
                reject()
                console.log('error: ');
                console.log(err)
            }).run();
    })

}



module.exports = splitVideo;