const XLSX = require('xlsx')
const fs = require('fs')
const workbook = XLSX.readFile('./task_data_2982905.xlsx');
const child_process = require('child_process')


var sheetNames = workbook.SheetNames;
var sheetname = sheetNames[0];

var worksheet = workbook.Sheets[sheetNames[0]]


const headers = {};
var originData = [];
var data = []

const keys = Object.keys(worksheet);
keys
// 过滤以 ! 开头的 key
    .filter(k => k[0] !== '!')
    // 遍历所有单元格
    .forEach(k => {
        // 如 A11 中的 A
        let col = k.substring(0, 1);
        // 如 A11 中的 11
        let row = parseInt(k.substring(1));
        // 当前单元格的值
        let value = worksheet[k].v;

        // 保存字段名
        if (row === 1) {
            headers[col] = value;
            return;
        }

        // 解析成 JSON
        if (!originData[row]) {
            originData[row] = {};
        }
        originData[row][headers[col]] = value;
    });



function loadingVideos() {
    let maxLength = 1;
    let i = 0;
    let promiseAll = []
    while (data.length > 0 && maxLength > i) {
        var videoInfo = data.pop();
        if (videoInfo) {
            promiseAll.push(loadingVideo(videoInfo))
        }
        i += 1
    }


    return Promise.all(promiseAll)
}

function mainLoadingVideo(cb){
    loadingVideos().then(() => {
        if (data.length > 0) {
            mainLoadingVideo(cb)
        }else{
            cb()
        }

    })
}


function mainLoadingVVT(cb) {


    loadingVVTS().then(() => {
        if (data.length > 0) {
            mainLoadingVVT(cb)
        }else{
            cb()
        }
    })
}

function main(){
    data = JSON.parse(JSON.stringify(originData))
    mainLoadingVVT(function(){
        data = JSON.parse(JSON.stringify(originData))
        mainLoadingVideo(()=>{
            console.log('loading end')
        })
    })
}


function loadingVVTS(){
    let maxLength = 4;
    let i = 0;
    let promiseAll = []
    while (data.length > 0 && maxLength > i) {
        var videoInfo = data.pop();
        if (videoInfo) {
            promiseAll.push(loadingVVT(videoInfo))
        }
        i += 1
    }


    return Promise.all(promiseAll)
}


function loadingVVT(videoInfo) {
    var id = videoInfo.vvt.split(/\/|\?/)[3]
    var path = './tmp/'+id;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    return new Promise(resolve => {
        let child = child_process.fork('./get_vvt.js');
        child.send(id);
        child.on('message', function (m) {
            if (m == 'close') {
                child.send('close')
            }


        });
        child.on('exit', function () {
            resolve()

        })
    })


}


function loadingVideo(videoInfo) {
    var id = videoInfo.vvt.split(/\/|\?/)[3]
    var path = './tmp/'+id;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    videoInfo.id = id;
    return new Promise(resolve => {
        let child = child_process.fork('./get_video.js');
        child.send(videoInfo);
        child.on('message', function (m) {
            if (m == 'close') {
                child.send('close')
            }
        });
        child.on('exit', function () {
            resolve()
        })
    })


}

main()