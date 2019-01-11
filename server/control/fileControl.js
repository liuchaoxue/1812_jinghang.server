var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var UUID = require('node-uuid');
var Vvt = require('../util/webGetVvt');
var Video = require('../util/webGetVideo');
var Audio = require('../util/webGetAudio');
var FileModel = require('../model/fileModel');
var MaterialModel = require('../model/materialModel');
var config = require('../config/config');

var Promise = require('promise');


// let File = {};
//
// File._main = (req, res) => {
//     console.log('媒体中心');
//     res.send({code: 0, data: '媒体中心'});
// };
//
//
// File.ted_handle = (req, res) => {
//     let videoInfo = JSON.parse(req.body.data);
//
//     try {
//         loadingTedVVT(videoInfo, (id) => {
//             loadingTedVideo(videoInfo, id)
//         });
//     } catch (e) {
//         console.log(e);
//     }
//     res.send({code: 0, data: "成功访问回调post接口"})
// };
//
// File.bbc_handle = (req, res) => {
//     let audioInfo = JSON.parse(req.body.data);
//
//
//     try {
//         loadingBbcVVT(audioInfo, (data) => {
//             loadingBbcAudio(data, () => {
//                 console.log('bbc音频获取成功')
//             })
//         })
//     } catch (e) {
//         console.log(e);
//     }
//     res.send({code: 0, data: "成功访问回调post接口"})
// };
//
// File._upload = (req, res) => {
//
//     let vvt;
//     if (req.body.vvt) {
//         vvt = req.body.vvt;
//     } else {
//         vvt = '';
//     }
//
//     let promiseArr = [];
//     for (let i = 0; i < req.files.length; i++) {
//         let promise = new Promise((resolve) => {
//             let nameArr = req.files[i].originalname.split('.');
//             let format = nameArr[nameArr.length - 1];
//             let fileUuid = UUID.v1();
//             // let dest = path.join('media', fileUuid + '.' +  format);
//             let dest = '/upload/' + fileUuid + '.' + format;
//
//
//             fs.rename(req.files[i].path, CONFIG.filePath + dest, (err) => {
//                 if (err) {
//                     console.log(err);
//                     return resolve(err);
//                 }
//                 let pram = {
//                     fileName: req.files[i].originalname,
//                     originalFile: dest,
//                     vvt: vvt,
//                     source: 'upload'
//                 };
//                 new FileModel(pram).save((err, file) => {
//                     if (err) return console.log('错误:' + err);
//
//                     let options = {
//                         fileId: file._id,
//                         zhTitle: req.files[i].originalname,
//                         originalFile: dest,
//                         stage: 0
//                     };
//
//                     let newMaterial = new MaterialModel(options);
//                     newMaterial.save((err, result) => {
//                         let fileUrl = CONFIG.host + '/v1/media/' + result._id;
//
//                         MaterialModel.settingPath(result._id, fileUrl).then(result => {
//                             return resolve({file: file, material: result});
//
//                         })
//
//                     });
//
//                 });
//
//             })
//         });
//         promiseArr.push(promise);
//     }
//     Promise.all(promiseArr).then((data) => {
//         console.log('文件上传完成', data);
//         res.send({code: 0, data: data});
//     });
// };
//
//
// File.ewa_handle = (req, res) => {
//     let promiseArr = [];
//     let info = req.body;
//     for (let i = 0; i < req.files.length; i++) {
//         let promise = new Promise((resolve) => {
//             let nameArr = req.files[i].originalname.split('.');
//             let format = nameArr[nameArr.length - 1];
//             let fileUuid = UUID.v1();
//             let dest = '/ewa/' + fileUuid + '.' + format;
//             fs.rename(req.files[i].path, CONFIG.filePath + dest, (err) => {
//                 if (err) {
//                     console.log(err);
//                     return resolve(err);
//                 }
//                 let pram = {
//                     fileName: req.files[i].originalname,
//                     source: 'ewa',
//                     originalFile: dest,
//                     stage: 0
//                 };
//                 let newFile = new FileModel(pram);
//                 newFile.save(function (err, data) {
//
//                     if (err) {
//                         return console.log('错误:' + err)
//                     }
//
//                     let options = {
//                         fileId: data._id,
//                         source: 'ewa',
//                         category: info.category,
//                         zhTitle: info.zhTitle,
//                         enVvt: info.enVvt,
//                         zhVvt: info.zhVvt,
//                         enVvtLen: info.enVvtLen,
//                         zhVvtLen: info.zhVvtLen,
//                         difficulty: info.difficulty,
//                         duration: info.duration //视频时长
//                     };
//
//
//                     let newMaterial = new MaterialModel(options);
//                     newMaterial.save((err, result) => {
//                         let fileUrl = CONFIG.host + '/v1/media/' + result._id;
//
//                         MaterialModel.settingPath(result._id, fileUrl).then(result => {
//                             return resolve({file: data, material: result});
//
//                         })
//
//                     });
//
//
//                 });
//             })
//         });
//         promiseArr.push(promise);
//     }
//     Promise.all(promiseArr).then((data) => {
//         console.log('文件上传完成', data);
//         res.send({code: 0, data: data});
//     });
// };
//
// File._getall = (req, res) => {
//     FileModel.get_all_file().then((data) => {
//         res.send({code: 0, data: data});
//     })
// };
//
//
// File._getone = (req, res) => {
//     let id = req.query.fileId;
//     if (id) {
//         FileModel.get_one(id).then(data => {
//             return res.send({code: 0, data: data});
//         })
//     } else {
//         return res.send({code: 1, data: '缺少lessonId参数'})
//     }
// };
//
// function loadingBbcVVT(audioInfo, cb) {
//
//     let url = audioInfo.url;
//     let id = url.split('/').pop().split('.')[0];
//     let dest = CONFIG.filePath + '/bbc/' + id;
//
//     if (!fs.existsSync(dest)) {
//         fs.mkdirSync(dest);
//     }
//     audioInfo.dest = dest;
//     audioInfo.id = id;
//     Vvt.getBbcVvt(audioInfo, () => {
//         console.log('bbc字幕获取成功');
//         cb(audioInfo);
//     })
// }
//
// function loadingBbcAudio(data, cb) {
//     Audio.getTedAudio(data, () => {
//         cb();
//     })
// }
//
// function loadingTedVVT(videoInfo, cb) {
//     var id = videoInfo.vvt.split(/\/|\?/)[3];
//     let url = CONFIG.filePath + '/ted/' + id;
//     if (!fs.existsSync(url)) {
//         fs.mkdirSync(url);
//     }
//     Vvt.getTedVvt(id, url, () => {
//         console.log('字幕获取完成');
//         cb(id);
//     })
// }
//
// function loadingTedVideo(videoInfo, id) {
//     videoInfo.id = id;
//     Video.getTedVideo(videoInfo, () => {
//         console.log('视频获取完成')
//     })
// }


function upload(req, res) {
    let file = req.files[0];
    // let fileExtension = file.originalname.split('.').pop();
    let fileUuid = UUID.v4();
    let filePath = config.filePath + "/" + fileUuid.split('-')[0];
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    fs.rename(file.path, path.join(filePath, fileUuid ), (err) => {
        if (err) {
            return res.send({success: false, data: {}});
        }

        let newFile = {
            file_id: fileUuid,
        };

        new FileModel(newFile).save((err, file) => {
            return res.send({success: true, data: {id: fileUuid }})
        });

    });
}


router.post('/', upload)


// router.post('/', function () {
//
// });
//
//
// router.get('/', File._main);
// router.post('/ted/_handel', File.ted_handle); //处理web ted来源的文件
// router.post('/bbc/_handel', File.bbc_handle); //处理bbc来源文件
// router.post('/_upload', File._upload); //上传媒体文件
// router.get('/_getall', File._getall); //获取所有上传文件
// router.get('/_getone', File._getone); //获取单个file文件
//
// router.post('/ewa/_handel', File.ewa_handle); //获取ewa视频

module.exports = router;