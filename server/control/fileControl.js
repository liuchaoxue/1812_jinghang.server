var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send({code: 0, data: '爬虫处理'})
});

router.get('/_handel', function (req, res) {
    console.log(req.body);
    res.send({code: 0, data: "成功访问回调get接口"})
});

router.post('/_handel', function (req, res) {

    var urlData = JSON.parse(req.body);
    console.log(urlData.url, urlData.data);
    // console.log();
    
    console.log(urlData, url);
    res.send({code: 0, data: "成功访问回调post接口"})
});



module.exports = router;