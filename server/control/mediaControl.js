var express = require('express');
var router = express.Router();
const materialModel = require('../model/materialModel');
const config = require('../config/config')



router.get('/:id', function(req, res){

    materialModel.get_one(req.params.id).then(material=>{
        if(material&& material.cdnUrl) return res.redirect(material.cdnUrl);
        res.sendFile( config.filePath + material.originalFile)
    });
});



module.exports = router;