var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs')
//

fs.stat('/home/lgs/work/media/04c7ec3e/04c7ec3e-79ca-4136-b588-e58032376730', function(err,data){
    console.log(err)
    console.log(data)
})
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