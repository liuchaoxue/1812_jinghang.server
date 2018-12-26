var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('promise');
var LessonModel = require('../model/lessonModel');

let Lesson = {};

Lesson._add = (req, res) => {
    let lessonInfo = req.body;
    let pram = {};
    if(lessonInfo.cms && lessonInfo.zhTitle){

        pram.cms = lessonInfo.cms;
        pram.title = lessonInfo.zhTitle;

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
        if(lessonInfo.difficulty){
            pram.difficulty = lessonInfo.difficulty;
        }

        let newLesson = new LessonModel(pram);
        newLesson.save((err, data) => {
            if(err){
                return res.send({code: 1, data: '添加课程失败：' + err})
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
    if(lessonInfo.zhTitle){
        pram.title = lessonInfo.zhTitle;
    }
    if(lessonInfo.difficulty){
        pram.difficulty = lessonInfo.difficulty;
    }

    let page = lessonInfo.page;
    let num = lessonInfo.num;
    if(page && num){
        LessonModel.get_all_file(pram, parseInt(page), parseInt(num)).then(data => {
            return res.send({code :0, data: data});
        });
    }else {
        return  res.send({code: 1, data: '缺少参数'})
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
    if(lessonInfo.zhTitle){
        pram.title = lessonInfo.zhTitle;
    }
    if(lessonInfo.difficulty){
        pram.difficulty = lessonInfo.difficulty;
    }

    LessonModel.get_all_num(pram).then(data => {
        return res.send({code: 0, data: data.length});
    })
};

Lesson._update = (req, res) => {
    let lessonInfo = req.body;
    let pram = {};
    if(lessonInfo.cms){
        console.log('===============');
        console.log(lessonInfo.cms);
        console.log('===============');
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
    if(lessonInfo.zhTitle){
        pram.title = lessonInfo.zhTitle;
    }
    if(lessonInfo.difficulty){
        pram.difficulty = lessonInfo.difficulty;
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

Lesson._getone = (req, res) => {
    let lessonInfo = req.query;
    if(lessonInfo.lessonId){
        LessonModel.get_one(lessonInfo.lessonId).then(data => {
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: '缺少lessonId参数'})
    }
};

Lesson._get_iword_public = (req, res) => {
    let pram = {status: {$gte: 1}};
    pram.category = 'iWord';

    LessonModel.get_all_public(pram).then(data => {
        return res.send({code: 0, data: data});
    })
};

Lesson._get_italk_public = (req, res) => {
    let pram = {status: {$gte: 1}};
    pram.category = 'iTalk';

    LessonModel.get_all_public(pram).then(data => {
        return res.send({code: 0, data: data});
    })
};

Lesson._get_ifun_public = (req, res) => {
    let pram = {status: {$gte: 1}};
    pram.category = 'iFun';

    LessonModel.get_all_public(pram).then(data => {
        return res.send({code: 0, data: data});
    })
};

Lesson._get_ilisten_public = (req, res) => {
    let pram = {status: {$gte: 1}};
    pram.category = 'iListen';

    LessonModel.get_all_public(pram).then(data => {
        return res.send({code: 0, data: data});
    })
};

router.post('/_add', Lesson._add);  //添加ieord类型的课程
router.get('/_find', Lesson._find);  //根据条件分页获取课程
router.get('/_getnum', Lesson._getnum); //根据条件获取课程的总数量
router.post('/_update', Lesson._update); //更新课程信息
router.get('/_delete', Lesson._delete); //删除一个课程
router.post('/_public', Lesson._public); //定时发布一个课程
router.get('/_getone', Lesson._getone); //获取单个课程

router.get('/iword/_public', Lesson._get_iword_public); //huichi接口的对接
router.get('/italk/_public', Lesson._get_italk_public); //huichi接口的对接
router.get('/ifun/_public', Lesson._get_ifun_public); //huichi接口的对接
router.get('/ilisten/_public', Lesson._get_ilisten_public); //huichi接口的对接

module.exports = router;