var express = require('express');
var router = express.Router();
var fileControl = require('../control/fileControl');

//todo 将web爬虫的资源url处理并下载
router.use('/file', fileControl);

module.exports = router;