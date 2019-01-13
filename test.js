// var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs')
var Path =  require('path');
var basePath = Path.resolve('../media/')

var uploadPath = Path.resolve('../media/upload');

var ewaPath = Path.resolve('../media/ewa');
var tedPath = Path.resolve('../media/ted');
var bbcPath = Path.resolve('../media/bbc');

var ewaFiles = fs.readdirSync(ewaPath);

var uploadFiles = fs.readdirSync(uploadPath);
var tedFiles = fs.readdirSync(tedPath);
var bbcFiles= fs.readdirSync(bbcPath);

uploadFiles.forEach(function(ele,index){
    let path = Path.join(uploadPath, ele)
    let filePath =  Path.join( basePath, ele.split('-')[0]);
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
     fs.rename(path, Path.join(filePath, ele.split('.')[0]),(err)=>{
         if(!err) return console.log(path)
         console.log(err)
     })
})
ewaFiles.forEach(function(ele,index){
    let path = Path.join(ewaPath, ele)
    let filePath =  Path.join( basePath, ele.split('-')[0]);
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }

    fs.rename(path, Path.join(filePath, ele.split('.')[0]),(err)=>{
        if(!err) return console.log(path)
        console.log(err)
    })
})
// tedFiles.forEach(function(ele,index){
//     let path = Path.join(tedPath, ele)
//     let filePath =  Path.join( basePath, ele.split('-')[0]);
//     if (!fs.existsSync(filePath)) {
//         fs.mkdirSync(filePath);
//     }
//     fs.rename(path, Path.join(filePath, ele.split('.')[0]),(err)=>{
//         if(!err) return console.log(Path.join(filePath, ele.split('.')[0]))
//         console.log(err)
//     })
// })
// bbcFiles.forEach(function(ele,index){
//     let path = Path.join(bbcPath, ele)
//     let filePath =  Path.join( basePath, ele.split('-')[0]);
//     if (!fs.existsSync(filePath)) {
//         fs.mkdirSync(filePath);
//     }
//     fs.rename(path, Path.join(filePath, ele.split('.')[0]),(err)=>{
//         if(!err) return console.log(Path.join(filePath, ele.split('.')[0]))
//         console.log(err)
//     })
// })


//

// fs.stat('/home/lgs/work/media/04c7ec3e/04c7ec3e-79ca-4136-b588-e58032376730', function(err,data){
//     console.log(err)
//     console.log(data)
// })
// var a =ffmpeg('/home/lgs/work/media/04c7ec3e/04c7ec3e-79ca-4136-b588-e58032376730');
//     a.setStartTime('00:00:00')
//     .setDuration('5')
//     .output('trimed.mp3')
//
//     .on('end', function (err) {
//         if (!err) {
//             console.log('conversion Done');
//         }
//     })
//     .on('error', function (err) {
//         console.log('error: ', err);
//     }).run();



// ffmpeg('/home/lgs/work/media/04c7ec3e/04c7ec3e-79ca-4136-b588-e58032376730.mp4').size('640x480').autopad();