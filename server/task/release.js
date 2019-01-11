const interval = 60 * 1000 * 0.5;
const taskIntval = 60 * 1000 * 30;

const lessonModel = require('../model/lessonModel');
const funModel = require('../model/funModel');
const talkModel = require('../model/talkModel');
const listenModel = require('../model/listenModel');
const qcloudUpload = require('../util/qcloud-upload');

function Task() {
}

Task.currentTime = '';

// Task.currentTime1 = new Date('2020/01/01').getTime()



Task.release_all_lesson = () => {
    return lessonModel.get_need_public_lesson(Task.currentTime).then(lessonList => {
        return Promise.all(lessonList.map(lesson => Task.release_one_lesson(lesson)))
    })
};
Task.release_one_lesson = (lesson) => {
    let fileList = [];
    let audioList = lesson.cms.match(/!+\[audio]\(([^)]*)\)/gi) || [];
    let videoList = lesson.cms.match(/!+\[video]\(([^)]*)\)/gi) || [];
    let picList = lesson.cms.match(/!+\[video]\(([^)]*)\)/gi) || [];
    fileList = fileList.concat(audioList).concat(videoList).concat(picList).map(file => file.split(/\(|\)/)[1].split('/').pop())
   return new Promise(resolve => {
       Promise.all(fileList.map(file => {
           return qcloudUpload(file)
       })).then(() => {
           lessonModel.update_lesson({status: 2}, lesson._id).then(data => {
               console.log(lesson._id, '已发布');
               resolve()
           })
       }) //todo 上传失败
   })

};


Task.release_all_fun = () => {

    return funModel.get_need_public_fun(Task.currentTime).then(funList => {
        return Promise.all(funList.map(fun => Task.release_one_fun(fun)))
    })
};
Task.release_one_fun = (fun) => {
    return new Promise(resolve => {
        qcloudUpload(fun.materialId._id).then(() => {
            funModel.update_lesson({status: 2}, fun._id).then(() => {
                console.log(fun._id, '已发布');
                resolve()
            })
        }) //todo 上传失败
    })

};

Task.release_all_talk = () => {

    return talkModel.get_need_public_talk(Task.currentTime).then(talkList => {
        return Promise.all(talkList.map(talk => Task.release_one_talk(talk)))
    })
};
Task.release_one_talk = (talk) => {
    return new Promise(resolve => {

        qcloudUpload(talk.materialId._id).then(() => {
            talkModel.update_lesson({status: 2}, talk._id).then(() => {
                console.log(talk._id, '已发布');
                resolve()
            })
        }) //todo 上传失败
    })

};


Task.upload_cdn = (filelist) => {
    let allPromises = filelist.map(file => {
        return qcloudUpload(file)
    });
    return Promise.all(allPromises)
};


Task.hadRunTask = () => {
    let currentTime = parseInt(new Date().getTime() / taskIntval) * taskIntval;

    if (currentTime !== Task.currentTime) {
        Task.currentTime = currentTime;
        return false;
    }
    return true;
};



Task.run = () => {
    setInterval(() => {
        let hadRunTask = Task.hadRunTask();
        if (!hadRunTask) {
            Task.release_all_lesson()
                .then(() => {
                    console.log('======1========')
                    return Task.release_all_fun()
                })
                .then(()=>{
                    console.log('=============2')
                    return Task.release_all_talk()
                })
                .then(()=>{
                    console.log('===============发布完成')
                })
        }

    }, interval)
};
module.exports = Task;