const dateformat = require("dateformat")
const path = require("path");
const secretId = "AKIDTTl8Y3XF3EKHFKroJ8Y5h1Sxdp5P7Z7b";
const secretKey = "pCUefYKzXvmYM9sX3TlMpCTekiYEFC4t";
var COS = require("cos-nodejs-sdk-v5");
// 使用永久密钥创建实例
var cos = new COS({
    SecretId: secretId,
    SecretKey: secretKey
});
function qcloudUpload(localFile, className, fileType) {
    return new Promise((resolve, reject) => {
        let fileName = path.basename(localFile);
        let keyPrefix = "/ispace/"+ className +"/"+ fileType +"/" + dateformat(new Date(), "yyyymmdd") + "/";
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
                    resolve(data);
                    console.log(err, data);
                }
            }
        );
    });
}

module.exports = qcloudUpload;
