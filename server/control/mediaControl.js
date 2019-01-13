var express = require('express');
var router = express.Router();
const materialModel = require('../model/materialModel');
const config = require('../config/config')



router.get('/:id', function(req, res){
    let id = req.params.id.split('.')[0];
    materialModel.get_one(id).then(material=>{
        if(material&& material.files){
            let file = material.files[0];
            if(material.cdnUrl && material.files[0].cdn_url ) return res.redirect(material.files[0].cdn_url );
            return res.sendFile(config.filePath + "/" + file.file_id.split('-')[0]+"/" + file.file_id)
        }
        res.send({success: false})
    });
});



module.exports = router;