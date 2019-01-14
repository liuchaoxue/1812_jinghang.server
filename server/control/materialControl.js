var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('promise');
var MaterialModel = require('../model/materialModel');
var LessonModel = require('../model/lessonModel');
var FunModel = require('../model/funModel');
var TalkModel = require('../model/talkModel');
var LabelModel= require('../model/labelModel');
var FileModel = require('../model/fileModel');

var splitVideoTool = require('../util/splitVideo');
var UUID = require('node-uuid');


const config = require('../config/config');


let Material = {};

// Material._main = (req, res) => {
//     res.send({code: 0, data: '媒体库'})
// };
//
// Material._add = (req, res) => {
//     let materialInfo = req.body;
//     getPram(materialInfo, (result) => {
//         let newMaterial = new MaterialModel(result);
//         newMaterial.save((err, data) => {
//             if(err){
//                 return res.send({code: 1, data: '添加媒体文件失败'})
//             }
//             res.send({code: 0, data: data});
//         })
//     })
// };


Material._find = (req, res) => {
    let materialInfo = req.query;

    getPram(materialInfo, (result) => {
        let page = materialInfo.page;
        let num = materialInfo.num;
        let sort = materialInfo.sort ? JSON.parse(materialInfo.sort): undefined;
        let character = materialInfo.character;
        if(character){
            result["$or"]= [ //多条件，数组
                {enVvt : {$regex : character}},
                {zhVvt : {$regex : character}},
                {zhTitle : {$regex : character}},
                {enTitle : {$regex : character}},
                {abstract : {$regex : character}}
            ];
        }

        if(page && num){
            MaterialModel.get_all_file(result ,parseInt(page), parseInt(num), sort).then((data) => {
                return res.send({code: 0, data: data});
            })
        }else {
            return res.send({code: 1, data: "缺少参数"});
        }
    })
};

Material._getnum = (req, res) => {
    let materialInfo = req.query;
    getPram(materialInfo, (result) => {
        MaterialModel.get_all_num(result).then((data) => {
            return res.send({code: 0, data: data.length});
        })
    })
};

Material._update　= (req, res) => {
    let materialInfo = req.body;

    getPram(materialInfo, (result) => {
        let id = materialInfo.materialId;
        if(id){
            if(materialInfo.label){

                console.log(materialInfo.label);
                try{
                    let label = materialInfo.label;

                    result.label = JSON.parse(label);
                }catch (e) {
                    return res.send({code: 1, data: e})
                }
            }

            MaterialModel.update_material(result, id).then((data) => {
                return res.send({code: 0, data: data})
            })


        }else {
            return res.send({code: 1, data: '缺少materialId参数'})
        }
    })
};

Material._delete　= (req, res) => {
    let id = req.query.materialId;
    if(id){
        MaterialModel.get_one(id).then(result => {
            let fileUrl = result.fileUrl;
            rmFile(fileUrl, () => {
                MaterialModel.delete(id).then(data => {
                    return res.send({code: 0, data: data})
                })
            });
        });
    }else {
        return res.send({code: 1, data: '缺少materialId参数'})
    }
};

Material._getone = (req, res) => {
    let id = req.query.materialId;
    if(id){
        MaterialModel.get_one(id).then(data => {
            return res.send({code: 0, data: data})
        })
    }else {
        return res.send({code: 1, data: '缺少materialId参数'})
    }
};

Material._create = (req, res) => {
    let info = req.body;
    let pram = {};
    let newLesson;
    if(info.publicTime){
        pram.publicTime = info.publicTime;
    }
    // if(info.status){
        pram.status = info.status;
    // }
    if(info.stage){
        pram.stage = info.stage;
    }
    if(info.zhTitle){
        pram.title = info.zhTitle;
    }
    if(info.difficulty){
        pram.difficulty = info.difficulty;
    }
    if(info.class){
        pram.class = info.class;
    }
    if(info.label){
        pram.label = info.label;
    }
    if(info.materialId){
        pram.materialId = info.materialId;
    }else {
        return res.send({code: 1, data: "缺少materialId参数"});
    }

    if(info.category){
        pram.category = info.category;

        if(info.category == 'iFun'){
            newLesson = new FunModel(pram);
        }
        if(info.category == 'iTalk'){
            newLesson = new TalkModel(pram);
        }
    }
    else {
        return res.send({code: 1, data: "缺少category参数"});
    }

    // let newLesson = new LessonModel(pram);
    newLesson.save((err, data) => {
        if(err){
            return res.send({code: 1, data: '添加课程失败: '+err});
        }
        return res.send({code: 0, data: data});
    });
};

Material._find_by_vvtlen = (req, res) => {
    let materialInfo = req.query;

    let pram = {};
    if(materialInfo.category){
        pram.category = materialInfo.category;
    }
    if(materialInfo.enVvtLen){
        pram.enVvtLen = {$lte: parseInt(materialInfo.enVvtLen)};
    }
    if(materialInfo.zhVvtLen){
        pram.zhVvtLen = {$lte: parseInt(materialInfo.zhVvtLen)};
    }

    let page = materialInfo.page;
    let num = materialInfo.num;
    if(page && num){
        MaterialModel.get_all_file(pram, parseInt(page), parseInt(num)).then((data) => {
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: "缺少page或者num参数"});
    }
};

//创建＆筛选获取参数
function getPram(material, cb) {

    let pram = {};
    if(material.fileId){
        pram.fileId = material.fileId;
    }
    if(material.fileUrl){
        pram.fileUrl = material.fileUrl;
    }
    if(material.source){
        pram.source = material.source;
    }
    if(material.category){
        pram.category = material.category;
    }
    if(material.enTitle){
        pram.enTitle = material.enTitle;
    }
    if(material.zhTitle){
        pram.zhTitle = material.zhTitle;
    }
    if(material.abstract){
        pram.abstract = material.abstract;
    }
    if(material.label){
        pram.label = material.label;
    }
    if(material.enVvt){
        pram.enVvt = material.enVvt;
    }
    if(material.zhVvt){
        pram.zhVvt = material.zhVvt;
    }
    if(material.class){
        pram.class = material.class;
    }
    if(material.difficulty){
        pram.difficulty = material.difficulty;
    }
    if(material.enVvt){
        pram.enVvtLen = material.enVvt.length;
    }
    if(material.zhVvt){
        pram.zhVvtLen = material.zhVvt.length;
    }
    if(material.stage){
        pram.stage = material.stage;
    }

    cb(pram);
}

function splitVideo(req, res){
    /**
     * 实例输入
     * {
     *
     *  startTime:'00:00:03',
     *  duration: '5',
     *   "zhVvt": "高呀高呀",
     *   "enVvt": "",

     */
    let typeMap = {'audio': 'mp3', 'video': 'mp4', 'pic':'jpg'};

    MaterialModel.get_one(req.params.id).then((material)=>{
        console.log(material)
        if(!material) return res.send({success: false, data: {}})

        let allPromises=  material.files.map(file=>{
            let fileUuid = UUID.v4();

            let originPath = config.filePath + "/" + file.file_id.split('-')[0] + '/'+ file.file_id;
            let outPath = config.filePath + "/" + fileUuid.split('-')[0] + '/'+ fileUuid;
            return new Promise((resolve, reject)=>{
                 let type = typeMap[material.files[0].type];
                splitVideoTool(originPath, outPath, req.body.startTime, req.body.duration, type).then(()=>{
                    let newFile = {
                        file_id: fileUuid,
                    };
                    new FileModel(newFile).save((err, file) => {
                        if(err) return   reject()
                        return resolve(fileUuid)
                    });

                },()=>{reject()})
            })
        });

        Promise.all(allPromises).then((fileList)=>{

            let files = material.files.map((file, index)=>{
                file =  JSON.parse(JSON.stringify(file));
                file.file_id = fileList[index];
                delete file.cdn_url;
                return file
            });


            let newMaterial =  JSON.parse(JSON.stringify(material))
            newMaterial.files = files;

            newMaterial.mark= newMaterial.mark + "_spilt_" + UUID.v4();
            newMaterial.sourceMaterial = material._id;
            newMaterial.fileUrl =   "";
            newMaterial.enVvt = req.body.enVvt;
            newMaterial.zhVvt = req.body.zhVvt;
            newMaterial.enVvtLen = newMaterial.enVvt ?  newMaterial.enVvt.length : 0;
            newMaterial.zhVvtLen = newMaterial.zhVvt ?  newMaterial.zhVvt.length : 0;
            delete newMaterial._id;
            delete newMaterial.createTime;
            delete newMaterial.updateTime;

            new MaterialModel(newMaterial).save((err, material)=>{

                if(err) return res.send({success: false, data:{}})
                material.fileUrl =  config.host+"/v1/media/"+material._id +'.'+ (typeMap[newMaterial.files[0].type]||'mp4');
                material.save((err,material)=>{
                    res.send({success: true, data: material})
                });

            })




        },()=>{
            res.send({success: false, data: {}})

        })



    });

}


//删除文件
function rmFile(fileUrl, cb) {
    fs.unlink('./public/' + fileUrl, function (err) {
         if(err){
             console.log(err);
             return cb();
         }
         console.log('文件删除成功');
         return cb();
    })
}



function createLabel(labelName, category){
    return new Promise(resolve=>{
        console.log("1212")
        LabelModel.get_all_label({label: labelName, category: category}).then(result => {
            console.log(result)
            if(result.length > 0){
                console.log(result[0].label)
                return resolve(result[0].label)
            }
            console.log('===============')
            let newLabel = new LabelModel({label: labelName, category: category});
            newLabel.save((err, data) => {
                return resolve(labelName)
            });
        });
    });

}

//


function insertMaterial(req, res){

    /**
     * 实例输入
     * {
     *   source:"", //require
     *   source_id:"", //require
     *   "zhTitle": "喜马拉雅山高呀",
     *   "enTitle":"",
     *   "zhVvt": "高呀高呀",
     *   "enVvt": "",
     *   "class": '',
     *   "label":[],
     *   "category": ""
     *   "difficulty":'',
     *   "file": { //require
     *     "r": "low",
     *     "file_id": "1230i9093750895738945",
     *     "type": "audio"
     *   }
     * }
     * file.type有音频"audio"，视频"video"，图片"pic"
     */


    let typeMap = {'audio': 'mp3', 'video': 'mp4', 'pic':'jpg'};
    let newMaterial = req.body;
    newMaterial.files = [JSON.parse(JSON.stringify(newMaterial.file))];
    newMaterial.enVvtLen = newMaterial.enVvt ?  newMaterial.enVvt.length : 0;
    newMaterial.zhVvtLen = newMaterial.zhVvt ?  newMaterial.zhVvt.length : 0;
    newMaterial.mark = newMaterial.source + "_" + newMaterial.source_id;
    delete newMaterial.file;
    var promise =     newMaterial.label && newMaterial.category ? Promise.all(newMaterial.label.map(label=> createLabel(label, newMaterial.category))) : Promise.resolve(undefined)


        promise.then(label=>{
            newMaterial.label = label;
            MaterialModel.findOne({mark:newMaterial.mark}).then((material)=>{
                if(material){
                    let hadUpload =  !!material.files.find(file=> file.r === newMaterial.files[0].r);
                    if (hadUpload) return res.send({success: true, data: material});
                    material.files.push(newMaterial.files[0]);
                    material.save((err, material)=>{
                        if(err) return res.send({success: false, data:{}})
                        res.send({success: true, data: material})
                    })
                }else{
                    new MaterialModel(newMaterial).save((err, material)=>{
                        if(err) return res.send({success: false, data:{}})
                        material.fileUrl =  config.host+"/v1/media/"+material._id+'.'+ (typeMap[newMaterial.files[0].type]||'mp4');
                        material.save((err,material)=>{
                            res.send({success: true, data: material})
                        });
                    })
                }
            });
        });



}


router.post('/', insertMaterial);



// router.get('/', Material._main);
// router.post('/_add', Material._add);　//添加一条媒体
router.get('/_find', Material._find);  //根据筛选条件获取所有
router.get('/_getnum', Material._getnum);　//根据筛选条件获取所有数量
router.post('/_update', Material._update); //更新媒体信息

router.get('/_delete', Material._delete); //删除一条媒体数据
router.get('/_getone', Material._getone); //根据id获取一条媒体数据
router.post('/_createCMS', Material._create); //生成cms文章
router.post('/:id/splitFile', splitVideo);

router.get('/_find_vvtlen', Material._find_by_vvtlen); //通过字幕长度查询


module.exports = router;