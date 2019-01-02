var express = require('express');
var router = express.Router();

let TalkModel = require('../model/talkModel');
let Talk = {};



// router.post('/_add', Talk.create); //添加一个带有分类的标签 通用标签分类为all
// router.get('/_find', Talk.find_by_category); //通过分类查询标签

module.exports = router;