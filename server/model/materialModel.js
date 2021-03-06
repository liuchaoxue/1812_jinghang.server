var db = require('../config/dbConnection');
var Schema = db.mongoose.Schema;

var MaterialSchema = new Schema({
    // fileId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'File'
    // },
    mark: {
        type: String,
        required: true,
        unique: true
    },
    fileUrl: String,
    cdnUrl: Boolean,

    files:Array,

    source: String,
    category: String,
    enTitle: String,
    zhTitle: String,
    abstract: String,
    label: Array,
    sourceMaterial:{
        type: Schema.Types.ObjectId,
        ref: 'Material'
    },
    enVvt: String,
    zhVvt: String,
    enVvtLen: Number,
    zhVvtLen: Number,
    class: String,
    difficulty: String,
    stage: {type: Number, default:0}, //生成文章状态 0未生成，１已生成
    duration: Number, //视频时长


    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }

});

// {
//     fileId: {
//         type: Schema.Types.ObjectId,
//             ref: 'files'
//     },
//     source: String, //来源（ewa）
//     category: String, //类别（iword）
//     enTitle: String, //英文标题
//     zhTitle: String, //中文标题
//     abstract: String, //摘要
//     label: String, //标签
//     enVvt: String,　//英文字幕
//     zhVvt: String,　//中文字幕
//     class: String, //类型
//     difficulty: String, //难度
//     status: Number  //发布状态：０未发布，１待发布，２已发布
// }

//分页获取筛选条件下的所有文件
MaterialSchema.statics.get_all_file = function (options, page, num, sort) {
    sort = sort || {updateTime: -1};

    sort = sort || {"updateTime": -1};
    return new Promise(resolve => {
        this.find(options).sort(sort).then(materialList=>{
            var skip = (page-1)*num;
            return resolve({count: materialList.length, data: materialList.splice(skip, num)})
        })
    });

    // return this.find(options).skip((page - 1) * num).limit(num).sort(sort).exec();
};

//获取筛选条件下的所有文件数量
MaterialSchema.statics.get_all_num = function (options) {
    return this.find(options).exec();
};

//根据id获取一条数据
MaterialSchema.statics.get_one = function (id) {
    return this.findOne({_id: id})
        .populate('fileId')
        .exec();
};
MaterialSchema.statics.findByUrl = function (fileUrl) {
    return this.findOne({fileUrl: fileUrl}).exec();
};

//删除
MaterialSchema.statics.delete = function (id) {
    return this.remove({_id: id}).exec();
};

//更新
MaterialSchema.statics.update_material = function (options, id) {
    return this.update({_id: id}, {$set: options}).exec();
};


MaterialSchema.statics.findByMark = function (mark) {
    return this.findOne({mark: mark}).exec();
};




MaterialSchema.statics.updateFiles = function (mark, newMaterial) {
    return this.update( {mark: mark} , {$push: {files: newMaterial.file}}).exec();
};



module.exports = db.conn.model('Material', MaterialSchema);
