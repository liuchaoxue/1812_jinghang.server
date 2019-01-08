const dateformat = require("dateformat")
const path = require("path");
const secretId = "AKIDTTl8Y3XF3EKHFKroJ8Y5h1Sxdp5P7Z7b";
const secretKey = "pCUefYKzXvmYM9sX3TlMpCTekiYEFC4t";
var COS = require("cos-nodejs-sdk-v5");
const config = require('../config/config');
const materialModel = require('../model/materialModel');
// 使用永久密钥创建实例
var cos = new COS({
    SecretId: secretId,
    SecretKey: secretKey
});
function qcloudUpload(localFile,) {
    return new Promise((resolve, reject) => {
        materialModel.findByUrl(localFile).then(material=>{
            if(material.cdnUrl) return resolve();
            localFile = localFile.replace(config.host, config.filepath.replace('media/',''));
            let fileName = path.basename(localFile);
            let keyPrefix = "/ispace/media/" + dateformat(new Date(), "yyyymmdd") + "/";
            cos.sliceUploadFile(
                {
                    Bucket: "mediacenter-1255803335",
                    Region: "ap-beijing",
                    Key: keyPrefix + fileName,
                    FilePath: localFile
                },
                function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(data.Location)
                        materialModel.update_material({cdnUrl: "http://"+data.Location },material._id).then(()=>{
                            resolve(data);
                        }) //todo

                    }
                }
            );

        });


    });
}

module.exports = qcloudUpload;
