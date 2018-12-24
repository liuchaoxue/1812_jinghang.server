var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('promise');
var LessonModel = require('../model/lessonModel');

let Lesson = {};

Lesson._add = (req, res) => {
    let lessonInfo = req.body;
    let pram = {};
    if(lessonInfo.cms && lessonInfo.materialId && lessonInfo.category && lessonInfo.status && lessonInfo.stage){
        pram.cms = lessonInfo.cms;
        pram.materialId = lessonInfo.materialId;
        pram.category = lessonInfo.category;
        pram.status = lessonInfo.status;
        pram.stage = lessonInfo.stage;

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
    }
    if(lessonInfo.materialId){
        pram.materialId = lessonInfo.materialId;
    }
    if(lessonInfo.category){
        pram.category = lessonInfo.category;
    }
    if(lessonInfo.status){
        pram.status = lessonInfo.status;
    }
    if(lessonInfo.stage){
        pram.stage = lessonInfo.stage;
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
    }
    if(lessonInfo.materialId){
        pram.materialId = lessonInfo.materialId;
    }
    if(lessonInfo.category){
        pram.category = lessonInfo.category;
    }
    if(lessonInfo.status){
        pram.status = lessonInfo.status;
    }
    if(lessonInfo.stage){
        pram.stage = lessonInfo.stage;
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
    }
    if(lessonInfo.materialId){
        pram.materialId = lessonInfo.materialId;
    }
    if(lessonInfo.category){
        pram.category = lessonInfo.category;
    }
    if(lessonInfo.status){
        pram.status = lessonInfo.status;
    }
    if(lessonInfo.stage){
        pram.stage = lessonInfo.stage;
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

Lesson._public = (req, res) => {
    let lessonInfo = req.body;
    let id = lessonInfo.lessonId;
    let time = lessonInfo.time; //定时时间戳，精确到秒
    let nowTime = parseInt((Date.now())/1000);
    if(id　&& time){
        if(time <= nowTime){
            return res.send({code: 1, data: '设定时间小于当前时间'})
        }else {
            let timeout = time - nowTime;
            LessonModel.update_lesson({status: 1}, id).then(data => {
                setTimeout(() => {
                    LessonModel.update_lesson({status: 2}, id).then(data => {
                        console.log(id, '已发布');
                    })
                }, timeout);
                return res.send({code: 0, data: data})
            })
        }
    }else {
        return res.send({code: 1, data: '缺少参数'})
    }
};


router.post('/_add', Lesson._add);  //添加ieord类型的课程
router.get('/_find', Lesson._find);  //根据条件分页获取课程
router.get('/_getnum', Lesson._getnum); //根据条件获取课程的总数量
router.post('/_update', Lesson._update); //更新课程信息
router.get('/_delete', Lesson._delete); //删除一个课程
router.post('/_public', Lesson._public); //定时发布一个课程


module.exports = router;