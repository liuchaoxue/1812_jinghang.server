var express = require('express');
var router = express.Router();

let LabelModel = require('../model/labelModel');


let Label = {};

Label._create = (req , res) => {
    let labelInfo = req.body;
    if(labelInfo.label && labelInfo.category){
        let pram = {};
        pram.label = labelInfo.label;
        pram.category = labelInfo.category;

        let newLabel = new LabelModel(pram);
        newLabel.save((err, data) => {
            if(err){
                return res.send({code: 1, data: '添加标签失败：' + err})
            }
            return res.send({code: 0, data: data});
        });
    }else {
        return res.send({code: 1, data: '缺少参数'});
    }
};

Label.find_by_category = (req, res) => {
    let labelInfo = req.query;
    let pram = {};

    if(labelInfo.category || labelInfo.all){
        pram.$or= [];
    }
    if(labelInfo.category){
        pram.$or.push({category: labelInfo.category});
    }
    if(labelInfo.all){
        pram.$or.push({category: labelInfo.all});
    }

    LabelModel.get_all_label(pram).then(data => {
        console.log(data);
        return res.send({code: 0, data: data})
    });
};

router.post('/_add', Label._create); //创建一个带分类的标签，all为共有标签
router.get('/_find', Label.find_by_category); //

module.exports = router;