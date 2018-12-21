var express = require('express');
var router = express.Router();
var fileControl = require('../control/fileControl');


router.use('/file', fileControl); //媒体中心的文件处理（包括爬虫的文件下载处理，媒体文件的上传处理） todo 音频



module.exports = router;