var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var Vvt = require('../util/webGetVvt');
var Video = require('../util/webGetVideo');
var Promise = require('promise');

//todo mongodb的添加

let File = {};

File._main = (req, res) => {
    console.log('媒体中心');
    res.send({code: 0, data: '媒体中心'});
};

File._handle = (req, res) => {
    let videoInfo = JSON.parse(req.body.data);
    //爬虫穿过来的示例数据
    // var videoInfo = {
    //     "content": "Nadjia Yousif: Why you should treat the tech you use at work like a colleague | TED Talk",
    //     "url": "https://www.ted.com/talks/nadjia_yousif_why_you_should_treat_the_tech_you_use_at_work_like_a_colleague",
    //     "description": "Imagine your company hires a new employee and then everyone just ignores them, day in and day out, while they sit alone at their desk getting paid to do nothing. This situation actually happens all the time -- when companies invest millions of dollars in new tech tools only to have frustrated employees disregard them, says Nadjia Yousif. In this fun and practical talk, she offers advice on how to better collaborate with the technologies in your workplace -- by treating them like colleagues.",
    //     "interactionCount": "623054",
    //     "uploadDate": "2018-12-12T15:54:30+00:00",
    //     "vvt": "ted://talks/27692?source\\u003dfacebook"
    // };
    try{
        loadingVVT(videoInfo, (id) => {
            loadingVideo(videoInfo, id)
        });
    }catch (e) {
        console.log(e);
    }
    res.send({code: 0, data: "成功访问回调post接口"})
};

File._upload = (req, res) => {
    let promiseArr = [];
    for(let i=0;i<req.files.length;i++){
        let promise = new Promise((resolve) => {
            let dest = path.join('./server', 'data', 'upload', req.files[i].originalname);
            fs.rename(req.files[i].path, dest, (err) => {
                if(err) {
                    console.log(err);
                    return resolve(err);
                }
                return resolve(req.files[i].originalname);
            })
        });
        promiseArr.push(promise);
    }
    Promise.all(promiseArr).then((data) => {
        console.log('文件上传完成', data);
        res.send({code: 0, data: '文件上传完成'});
    });
};

function loadingVVT(videoInfo, cb) {
    var id = videoInfo.vvt.split(/\/|\?/)[3];
    var url = path.join('./server','data', 'ted', id);
    if (!fs.existsSync(url)) {
        fs.mkdirSync(url);
    }
    Vvt.getTedVvt(id, url, () => {
        console.log('字幕获取完成');
        cb(id);
    })
}

function loadingVideo(videoInfo, id) {
    videoInfo.id = id;
    Video.getTedVideo(videoInfo, () => {
        console.log('视频获取完成')
    })
}

router.get('/', File._main);
router.post('/_handel', File._handle); //处理web ted来源的文件
router.post('/_upload', File._upload); //上传媒体文件

module.exports = router;