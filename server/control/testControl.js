var express = require('express');
var router = express.Router();



router.get('/*', function(req, res){
    console.log(req)
    res.sendFile('')
}); //添加一个带有分类的标签 通用标签分类为all



module.exports = router;