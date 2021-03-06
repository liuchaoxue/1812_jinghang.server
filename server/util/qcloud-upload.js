const dateformat = require("dateformat")
const path = require("path");

var COS = require("cos-nodejs-sdk-v5");
const config = require('../config/config');
const secretId = config.secretId;
const secretKey = config.secretKey;
const materialModel = require('../model/materialModel');
// 使用永久密钥创建实例
var cos = new COS({
    SecretId: secretId,
    SecretKey: secretKey
});
const typeMap = {'audio': 'mp3', 'video': 'mp4', 'pic':'jpg'};
function qcloudUpload(id) {
    return new Promise((resolve, reject) => {
        console.log('=============start')
        materialModel.get_one(id).then(material=>{
            if(material.cdnUrl) return resolve();
            let files = material.files;


            let allPromises = files.map((file)=>{
                let filePath = config.filePath + "/" + file.file_id.split('-')[0]+"/" + file.file_id
                let fileName = file.file_id+"."+(typeMap[file.type]||'mp4');
                return uploadToCDN(filePath, fileName)
            });
            Promise.all(allPromises).then(function(cdnFiles){

                let newfiles  = material.files = material.files.map((file, index)=>{
                    let newFile = {r: file.r, file_id: file.file_id, cdn_url:cdnFiles[index],type:file.type};

                    return newFile
                });
                material.files =  JSON.parse(JSON.stringify(newfiles))
                material.cdnUrl = true;
                material.save((err, materialInfo)=>{

                    if(err) return reject()
                    resolve(materialInfo)
                })


            },(err)=>{
                reject()
            })
        });
    });
}

function uploadToCDN(filePath,fileName){
    return new Promise((resolve, reject) => {
        // let fileName = path.basename(filePath);
        let keyPrefix = "/ispace/media/" + dateformat(new Date(), "yyyymmdd") + "/";
        cos.sliceUploadFile(
            {
                Bucket: "mediacenter-1255803335",
                Region: "ap-beijing",
                Key: keyPrefix + fileName,
                FilePath: filePath
            },
            function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    console.log('========================')
                        resolve("http://"+ data.Location);
                }
            }
        );
    });

}

module.exports = qcloudUpload;
