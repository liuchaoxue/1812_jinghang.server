var fs = require('fs');
var path = require('path');

var FileModel = require('../model/fileModel');
var MaterialModel = require('../model/materialModel');
var LessonModel = require('../model/lessonModel');
var config = require('../config/config');

var Promise = require('promise');


function updateFileModel() {
    return new Promise(resolve=>{

        FileModel.get_all_num({}).then(fileList => {
            let allPromises = fileList.map(file=>updateOneFileModel(file))
            Promise.all(allPromises).then(()=>{
                resolve()
            })
        })
    })


}


function updateOneFileModel(file) {
    file = (JSON.parse(JSON.stringify(file)))
    return new Promise(resolve=>{
        let updateInfo = {
            fileUrl: undefined,
            file_id: file.fileUrl.split('/').pop().split('.')[0]

        };
        console.log(updateInfo)
        FileModel.rename(updateInfo, file._id).then((err)=>{
            console.log(err)
            resolve()
        },(err)=>{
            console.log(err)
        })
    })

}




function updateMaterialModel() {
    return new Promise(resolve=>{
        MaterialModel.get_all_num({}).then(materailList => {
            let allPromises = materailList.map(materail=>updateOneMaterialModel(materail))
            Promise.all(allPromises).then(()=>{
                resolve()
            })
        })
    })
}


function updateOneMaterialModel(material) {
    material = (JSON.parse(JSON.stringify(material)));
    let typeMap = {
        'mp4': 'video',
        'mp3': 'audio',
        'jpg': 'pic',
        'png': 'pic',
        'gif': 'pic',
    };

    return new Promise(resolve=>{
        var file_id = material.fileUrl.split('/').pop().split('.')[0];
        var type = typeMap[material.fileUrl.split('/').pop().split('.')[1]]
        let updateInfo = {
            fileUrl: config.host+'/v1/media/'+material._id,
            files:[{'r':'default', file_id:file_id, type: type }],
            mark: material.source+"_"+ material.fileUrl.split('/').pop().split('.')[0]
        };
        MaterialModel.update_material(updateInfo, material._id).then(()=>{
            resolve()
        })
    })

}


function updateLessonModel() {
    return new Promise(resolve=>{
        LessonModel.get_all_num({}).then(lessonList => {
            let allPromises = lessonList.map(lesson=>updateOneLessonModel(lesson));
            Promise.all(allPromises).then(()=>{
                resolve()
            })
        })
    })
}


function updateOneLessonModel(lesson) {
    lesson = (JSON.parse(JSON.stringify(lesson)))


    return new Promise(resolve=>{
        let fileList = [];
        let audioList = lesson.cms.match(/!+\[audio]\(([^)]*)\)/gi) || [];
        let videoList = lesson.cms.match(/!+\[video]\(([^)]*)\)/gi) || [];
        let picList = lesson.cms.match(/!+\[pic]\(([^)]*)\)/gi) || [];
        fileList = fileList.concat(audioList).concat(videoList).concat(picList).map(file => file.split(/\(|\)/)[1])


        var allPromises = fileList.map(file =>getMaterial(file));
        let cms = lesson.cms
        Promise.all(allPromises).then(materialList=>{
            materialList.forEach((material, index)=>{
                if(!material) return ;
                cms = cms.replace(fileList[index], config.host+'/v1/media/'+material._id,)
            })
            let updateInfo = {
                cms : cms

            };
            LessonModel.update_lesson(updateInfo, lesson._id).then(()=>{
                resolve()
            })

        });
    })
}
function getMaterial(fileUrl){
    return new Promise(reslove=>{

        MaterialModel.findByUrl(fileUrl).then((material)=>{
            console.log('===========')
            console.log(material)
            reslove(material)
        })
    })
}



function main(){
    setTimeout(function(){
        console.log('===================2')
        updateLessonModel().then(()=>{
            console.log('================1')
            updateFileModel().then(()=>{
                console.log('================2')
                updateMaterialModel().then(()=>{
                    console.log('================end')
                })

            })
        });
    },5000)

}

module.exports = {
    main: main
};

