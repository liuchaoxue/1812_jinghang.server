var express = require('express');
var router = express.Router();
var qcloudUpload = require('../util/qcloud-upload');


let TalkModel = require('../model/talkModel');
let Talk = {};

Talk._add = (req, res) => {
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
        if(lessonInfo.class){
            pram.class = lessonInfo.class;
        }
        if(lessonInfo.publicTime){
            pram.publicTime = lessonInfo.publicTime;
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

        let newFun = new TalkModel(pram);
        newFun.save((err, data) => {
            if(err){
                return res.send({code: 1, data: '添加课程失败：' + err})
            }
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: "缺少参数"})
    }
};

Talk._find = (req, res) => {
    let lessonInfo = req.query;
    let pram = {};
    getPram(lessonInfo, pram, (result) => {
        let page = lessonInfo.page;
        let num = lessonInfo.num;
        if(page && num){
            TalkModel.get_all_file(result, parseInt(page), parseInt(num)).then(data => {
                return res.send({code :0, data: data});
            });
        }else {
            return  res.send({code: 1, data: '缺少参数'})
        }
    });
};

Talk._getnum = (req, res) => {
    let lessonInfo = req.query;
    let pram = {};
    getPram(lessonInfo, pram, (result) => {
        TalkModel.get_all_num(result).then(data => {
            return res.send({code: 0, data: data.length});
        })
    });
};

Talk._update = (req, res) => {
    let lessonInfo = req.body;
    let pram = {};
    getPram(lessonInfo, pram, (result) => {
        if(lessonInfo.lessonId){
            TalkModel.update_lesson(result, lessonInfo.lessonId).then(data => {
                return res.send({code: 0, data: data});
            })
        }else {
            return res.send({code: 1, data: '缺少lessonId参数'})
        }
    });
};

Talk._delete = (req, res) => {
    let lessonInfo = req.query;
    if(lessonInfo.lessonId){
        TalkModel.delete(lessonInfo.lessonId).then(data => {
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: '缺少lessonId参数'})
    }
};

// Talk._public = (req, res) => {
//     let lessonInfo = req.body;
//     let id = lessonInfo.lessonId;
//     let time = lessonInfo.time; //定时时间戳，精确到秒
//     let nowTime = parseInt((Date.now())/1000);
//     if(id　&& time){
//         if(time <= nowTime){
//             return res.send({code: 1, data: '设定时间小于当前时间'})
//         }else {
//             let timeout = time - nowTime;
//             let pram = {status: 1};
//             pram.publicTime = time;
//             TalkModel.update_lesson(pram, id).then(data => {
//                 setTimeout(() => {
//                     TalkModel.update_lesson({status: 2}, id).then(data => {
//                         console.log(id, '已发布');
//                     })
//                 }, timeout * 1000);
//                 return res.send({code: 0, data: data})
//             })
//         }
//     }else {
//         return res.send({code: 1, data: '缺少参数'})
//     }
// };


Talk.release =  function(req, res){

    let lessonInfo = req.body;
    let id = req.params.id;
    let time = lessonInfo.time; //定时时间戳，精确到秒
    let nowTime = parseInt((Date.now())/1000);

    if(time && time <= nowTime) {
        return res.send({code: 1, data: '设定时间小于当前时间'})
    }
    if(time){
        TalkModel.update_lesson({publicTime: time, status:1}, id).then(data => {
            return res.send({code: 0, data: data})
        })
    }else{
        TalkModel.get_one(id).then(talk=>{
            if(!talk) return  res.send({code:1, data:"该iTalk不存在"})
            qcloudUpload(talk.materialId._id).then(()=>{
                TalkModel.update_lesson({publicTime: nowTime ,status:2}, id).then(data => {
                    return res.send({code: 0, data: data})
                })
            })
        })
    }
};

Talk._getone = (req, res) => {
    let lessonInfo = req.query;
    if(lessonInfo.lessonId){
        TalkModel.get_one(lessonInfo.lessonId).then(data => {
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: '缺少lessonId参数'})
    }
};

function getPram(lessonInfo, pram, cb) {

    if(lessonInfo.cms){
        pram.cms = lessonInfo.cms;
    }
    if(lessonInfo.materialId){
        pram.materialId = lessonInfo.materialId;
    }
    if(lessonInfo.category){
        pram.category = lessonInfo.category;
    }
    if(lessonInfo.class){
        pram.class = lessonInfo.class;
    }
    if(lessonInfo.publicTime){
        pram.publicTime = lessonInfo.publicTime;
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
    if(lessonInfo.fun){
        pram.fun = lessonInfo.fun;
    }

    cb(pram)
}

router.post('/_add', Talk._add); //添加一个带有分类的标签 通用标签分类为all
router.get('/_find', Talk._find); //通过分类查询标签
router.get('/_getnum', Talk._getnum); //根据条件获取课程的总数量
router.post('/_update', Talk._update); //更新课程信息
router.get('/_delete', Talk._delete); //删除一个课程
router.post('/_public', Talk.release); //定时发布一个课程
router.post('/:id/release', Talk.release); //发布一个课程

router.get('/_getone', Talk._getone); //获取单个课程


module.exports = router;