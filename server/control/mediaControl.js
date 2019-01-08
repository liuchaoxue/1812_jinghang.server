var express = require('express');
var router = express.Router();
const materialModel = require('../model/materialModel');


var config = require('../config/config')

router.get('*', function(req, res){
    let fileUrl = config.filepath+req.url;
    let path = config.host + 'data'+req.url
    materialModel.findByUrl(path).then(material=>{
        if(material&& material.cdnUrl) return res.redirect("http://"+material.cdnUrl);
        res.sendFile(fileUrl)
    });
});



module.exports = router;