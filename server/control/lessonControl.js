var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('promise');
var LessonModel = require('../model/lessonModel');

let Lesson = {};

Lesson._iword_add = (req, res) => {
    let lessonInfo = req.body;
    let pram = {};
    if(lessonInfo.cms && lessonInfo.materialId && lessonInfo.category){
        pram.cms = lessonInfo.cms;
        pram.materialId = lessonInfo.materialId;
        pram.category = lessonInfo.category;

        let newLesson = new LessonModel(pram);
        newLesson.save((err, data) => {
            if(err){
                return res.send({code: 1, data: '添加课程失败'})
            }
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: "缺少参数"})
    }
};

Lesson._find = (req, res) => {
    let lessonInfo = req.query;
    let pram = {};
    if(lessonInfo.cms){
        pram.cms = lessonInfo.cms;
    }else if(lessonInfo.materialId){
        pram.materialId = lessonInfo.materialId;
    }else if(lessonInfo.category){
        pram.category = lessonInfo.category;
    }

    let page = lessonInfo.page;
    if(page){
        LessonModel.get_all_file(pram, parseInt(page)).then(data => {
            return res.send({code :0, data: data});
        });
    }else {
        return  res.send({code: 1, data: '缺少page参数'})
    }
};

Lesson._getnum = (req, res) => {
    let lessonInfo = req.query;
    let pram = {};
    if(lessonInfo.cms){
        pram.cms = lessonInfo.cms;
    }else if(lessonInfo.materialId){
        pram.materialId = lessonInfo.materialId;
    }else if(lessonInfo.category){
        pram.category = lessonInfo.category;
    }
    LessonModel.get_all_num(pram).then(data => {
        return res.send({code: 0, data: data.length});
    })
};

Lesson._update = (req, res) => {
    let lessonInfo = req.body;
    let pram = {};
    if(lessonInfo.cms){
        pram.cms = lessonInfo.cms;
    }else if(lessonInfo.materialId){
        pram.materialId = lessonInfo.materialId;
    }else if(lessonInfo.category){
        pram.category = lessonInfo.category;
    }

    if(lessonInfo.lessonId){
        LessonModel.update_lesson(pram, lessonInfo.lessonId).then(data => {
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: '缺少lessonId参数'})
    }
};

Lesson._delete = (req, res) => {
    let lessonInfo = req.query;
    if(lessonInfo.lessonId){
        LessonModel.delete(lessonInfo.lessonId).then(data => {
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: '缺少lessonId参数'})
    }
};

router.post('/iword/_add', Lesson._iword_add);  //添加ieord类型的课程
router.get('/_find', Lesson._find);  //根据条件分页获取课程
router.get('/_getnum', Lesson._getnum); //根据条件获取课程的总数量
router.post('/_update', Lesson._update); //更新课程信息
router.get('/_delete', Lesson._delete); //删除一个课程

module.exports = router;