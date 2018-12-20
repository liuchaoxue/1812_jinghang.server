var request = require('request');
const fs = require('fs');

function getEnvvt(id){
    return new Promise((resolve)=>{
        request('https://hls.ted.com/talks/'+ id +'/subtitles/en/full.vtt', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                fs.writeFile("./tmp/"+id+"/"+id+'_en.vvt', body, function(err) {
                    if(err) {
                        console.log(err);
                        return resolve()
                    }

                    console.log("The file was saved!");
                    return resolve()
                });
            }else{
                resolve()
            }
        })
    })

}


function getZhvvt(id){
    return new Promise((resolve)=>{
        request('https://hls.ted.com/talks/'+ id +'/subtitles/zh-cn/full.vtt', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                fs.writeFile("./tmp/"+id+"/"+id+'_zh.vvt', body, function(err) {
                    if(err) {
                        console.log(err);
                        return resolve()
                    }

                    console.log("The file was saved!");
                    return resolve()
                });
            }else{
                resolve()
            }
        })
    })
}


process.on('message', function(data){
    if(data =='close'){
        return process.exit()
    }
    var promiseAll=[getEnvvt(data),getZhvvt(data)]
    Promise.all(promiseAll).then(function(){
        process.send('close');
    })


    // process.send(data);
});

