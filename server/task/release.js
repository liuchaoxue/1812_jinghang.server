const interval = 60 * 1000 * 0.2;
const lessonModel = require('../model/lessonModel');
const funModel = require('../model/funModel');
const talkModel = require('../model/talkModel');
const listenModel = require('../model/listenModel');
const qcloudUpload = require('../util/qcloud-upload');

function Task() {
}

Task.status = {time: new Date(), status: 0};

Task.release_all_lesson = () => {
    lessonModel.get_need_public_lesson().then(lessonList => {
        console.log(lessonList)
        return Promise.all(lessonList.map(lesson => Task.release_one_lesson(lesson)))
    })
};
Task.release_one_lesson = (lesson) => {
    let fileList = [];
    let audioList = lesson.cms.match(/!+\[audio]\(([^)]*)\)/gi) || [];
    let videoList = lesson.cms.match(/!+\[video]\(([^)]*)\)/gi) || [];
    fileList = fileList.concat(audioList).concat(videoList).map(file => file.split(/\(|\)/)[1])
    Promise.all(fileList.map(file => {
        return qcloudUpload(file)
    })).then(() => {

        //
        // lessonModel.update_lesson({status: 2}, lesson._id).then(datas => {
        //     console.log(lesson._id, '已发布');
        // })
    }) //todo 上传失败


};

Task.upload_cdn = (filelist) => {
    let allPromises = filelist.map(file => {
        return qcloudUpload(file)
    });
    return Promise.all(allPromises)
};


Task.hadRunTask = () => {
    let currentTime = parseInt(new Date().getTime() / (60 * 1000 * 30)) * (60 * 1000 * 30);

    if (currentTime !== Task.status.time && !Task.status.status) {
        Task.status = {time: currentTime, status: 1};
        return false;
    }
    return true
};

Task.run = () => {
    setInterval(() => {
        let hadRunTask = Task.hadRunTask();
        console.log('=============state===' + hadRunTask)

        if (!hadRunTask) {
            Task.release_all_lesson();
        }

    }, interval)
};
module.exports = Task;