var express = require('express');
var router = express.Router();
var fileControl = require('../control/fileControl');

//web爬虫处理api
router.use('/file', fileControl);

module.exports = router;