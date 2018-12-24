var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('promise');
var MaterialModel = require('../model/materialModel');

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
        if(page){
            MaterialModel.get_all_file(result, parseInt(page)).then((data) => {
                return res.send({code: 0, data: data});
            })
        }else {
            return res.send({code: 1, data: "缺少page参数"});
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
        MaterialModel.delete(id).then(data => {
            return res.send({code: 0, data: data})
        })
    }else {
        return res.send({code: 1, data: '缺少materialId参数'})
    }
};

//创建＆筛选获取参数
function getPram(material, cb) {
    let pram = {};
    if(material.fileId){
        pram.fileId = material.fileId;
    }else if(material.source){
        pram.source = material.source;
    }else if(material.category){
        pram.category = material.category;
    }else if(material.enTitle){
        pram.enTitle = material.enTitle;
    }else if(material.zhTitle){
        pram.zhTitle = material.zhTitle;
    }else if(material.abstract){
        pram.abstract = material.abstract;
    }else if(material.label){
        pram.label = material.label;
    }else if(material.enVvt){
        pram.enVvt = material.enVvt;
    }else if(material.zhVvt){
        pram.zhVvt = material.zhVvt;
    }else if(material.class){
        pram.class = material.class;
    }else if(material.difficulty){
        pram.difficulty = material.difficulty;
    }

    cb(pram);
}


router.get('/', Material._main);
router.post('/_add', Material._add);　//添加一条媒体
router.get('/_find', Material._find);  //根据筛选条件获取所有
router.get('/_getnum', Material._getnum);　//根据筛选条件获取所有数量
router.post('/_update', Material._update); //更新媒体信息
router.get('/_delete', Material._delete); //删除一条媒体数据


module.exports = router;