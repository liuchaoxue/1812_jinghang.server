var db = require('../config/dbConnection');
var Schema = db.mongoose.Schema;
var config = require('../config/config');

var FileInfoSchema = new Schema({
    source: String,
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

//获取所有文件
FileInfoSchema.statics.get_all_file = function () {
    return this.find().sort({updateTime: -1}).exec();
};

//获取所有文件数量
FileInfoSchema.statics.get_all_num = function () {
    return this.find().exec();
};

//删除一个文件
FileInfoSchema.statics.delete = function (id) {
    return this.remove({_id: id}).exec();
};

//重命名
FileInfoSchema.statics.rename = function (options, id) {
    return this.update({_id: id}, options).exec();
};

//根据id获取一条数据
FileInfoSchema.statics.get_one = function (id) {
    return this.findOne({_id: id}).exec();
}



module.exports = db.conn.model('File', FileInfoSchema);
