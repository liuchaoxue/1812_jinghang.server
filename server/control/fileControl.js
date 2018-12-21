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

    var urlData = JSON.parse(req.body.data);

    //爬虫穿过来的示例数据
    // var example = {
    //     "content": "Nadjia Yousif: Why you should treat the tech you use at work like a colleague | TED Talk",
    //     "url": "https://www.ted.com/talks/nadjia_yousif_why_you_should_treat_the_tech_you_use_at_work_like_a_colleague",
    //     "description": "Imagine your company hires a new employee and then everyone just ignores them, day in and day out, while they sit alone at their desk getting paid to do nothing. This situation actually happens all the time -- when companies invest millions of dollars in new tech tools only to have frustrated employees disregard them, says Nadjia Yousif. In this fun and practical talk, she offers advice on how to better collaborate with the technologies in your workplace -- by treating them like colleagues.",
    //     "interactionCount": "623054",
    //     "uploadDate": "2018-12-12T15:54:30+00:00",
    //     "vvt": "ted://talks/27692?source\\u003dfacebook"
    // }

    //todo 异步将这一条示例数据中的字幕和视频文件下载到 server/data/ted 目录下
    res.send({code: 0, data: "成功访问回调post接口"})
});


module.exports = router;