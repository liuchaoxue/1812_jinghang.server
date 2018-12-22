var db = require('../config/dbConnection');
var Schema = db.mongoose.Schema;

var FileSchema = new Schema({
    fileName: {
        type: String,
        unique: true
    },
    fileUrl: String,
    vvt: String,
    source: String
});

//获取所有文件
FileSchema.statics.get_all_file = function (options, page) {
    return this.find(options).skip((page-1)*10).limit(10).exec();
};

//获取所有文件数量
FileSchema.statics.get_all_num = function () {
    return this.find().exec();
};

//删除一个文件
FileSchema.statics.delete = function (id) {
    return this.remove({_id: id}).exec();
};

//重命名
FileSchema.statics.rename = function (options, id) {
    return this.update({_id: id}, options).exec();
};

//根据id获取一条数据
FileSchema.statics.get_one = function (id) {
    return this.findOne({_id: id}).exec();
};

module.exports = db.conn.model('File', FileSchema);
