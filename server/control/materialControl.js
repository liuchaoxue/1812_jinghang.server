var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('promise');
var MaterialModel = require('../model/materialModel');
var LessonModel = require('../model/lessonModel');
var FunModel = require('../model/funModel');

let Material = {};

Material._main = (req, res) => {
    res.send({code: 0, data: '媒体库'})
};

Material._add = (req, res) => {
    let materialInfo = req.body;
    getPram(materialInfo, (result) => {
        let newMaterial = new MaterialModel(result);
        newMaterial.save((err, data) => {
            if(err){
                return res.send({code: 1, data: '添加媒体文件失败'})
            }
            res.send({code: 0, data: data});
        })
    })
};

Material._find = (req, res) => {
    let materialInfo = req.query;
    getPram(materialInfo, (result) => {
        let page = materialInfo.page;
        let num = materialInfo.num;
        if(page && num){
            MaterialModel.get_all_file(result, parseInt(page), parseInt(num)).then((data) => {
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
                result.label = JSON.parse(materialInfo.label);
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
    if(info.status){
        pram.status = info.status;
    }
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

    // if(info.materialId && info.zhTitle && info.category && info.status && info.difficulty){
    //     let pram = {};
    //     pram.cms = '# ' + info.zhTitle;
    //     pram.materialId = info.materialId;
    //     pram.title = info.zhTitle;
    //     pram.difficulty = info.difficulty;
    //     pram.category = info.category;
    //     pram.status = info.status;
    //     pram.stage = 1;
    //     if(info.publicTime){
    //         pram.publicTime = lessonInfo.publicTime;
    //     }
    //     if(info.class){
    //         pram.class = info.class;
    //     }
    //
    // }else {
    //     return res.send({code: 1, data: "缺少参数"});
    // }
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

    cb(pram);
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

router.get('/', Material._main);
router.post('/_add', Material._add);　//添加一条媒体
router.get('/_find', Material._find);  //根据筛选条件获取所有
router.get('/_getnum', Material._getnum);　//根据筛选条件获取所有数量
router.post('/_update', Material._update); //更新媒体信息
router.get('/_delete', Material._delete); //删除一条媒体数据
router.get('/_getone', Material._getone); //根据id获取一条媒体数据
router.post('/_createCMS', Material._create); //生成cms文章


module.exports = router;