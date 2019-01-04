var express = require('express');
var router = express.Router();
var fileControl = require('../control/fileControl');
var materialControl = require('../control/materialControl');
var lessonControl = require('../control/lessonControl');
var labelControl = require('../control/labelControl');
var funControl = require('../control/funControl');
var talkControl = require('../control/talkControl');

//路由到页面
router.get('/', function (req, res) {
    res.type('html');
    res.render('../public/html/index.html');
});

router.use('/file', fileControl); //媒体中心的文件处理（包括爬虫的文件下载处理，媒体文件的上传处理）
router.use('/material', materialControl); //媒体中心的媒体库
router.use('/lesson', lessonControl); //类别课程编辑管理 iWord
router.use('/label', labelControl); //标签中心管理

router.use('/ifun', funControl); //ifun课程管理
router.use('/italk', talkControl); //italk课程管理

//todo 爬虫数据对接到媒体中心　version 1.10

module.exports = router;