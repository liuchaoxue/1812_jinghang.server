var request = require('request');
const fs = require('fs');

let Vvt = {};

Vvt.getTedVvt = function (id, url, cb) {
    getEnvvt(id, url, () => {
        getZhvvt(id, url, () => {
            cb();
        })
    });
};

//获取英文字幕
function getEnvvt(id, url, cb){
    request('https://hls.ted.com/talks/'+ id +'/subtitles/en/full.vtt', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFile(url+"/"+id+'_en.vvt', body, function(err) {
                if(err) {
                    console.log(err);
                    cb()
                }
                console.log("The file was saved!");
                cb()
            });
        }else{
            cb()
        }
    })
}

//获取中文字幕
function getZhvvt(id, url, cb){
    request('https://hls.ted.com/talks/'+ id +'/subtitles/zh-cn/full.vtt', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFile(url+"/"+id+'_zh.vvt', body, function(err) {
                if(err) {
                    console.log(err);
                    cb();
                }
                console.log("The file was saved!");
                cb();
            });
        }else{
            cb();
        }
    })
}

module.exports = Vvt;

