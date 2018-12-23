var db = require('../config/dbConnection');
var Schema = db.mongoose.Schema;

var MaterialSchema = new Schema({
    fileId: {
        type: Schema.Types.ObjectId,
        ref: 'files'
    },
    source: String, //来源（ewa）
    category: String, //类别（iword）
    enTitle: String, //英文标题
    zhTitle: String, //中文标题
    abstract: String, //摘要
    label: String, //标签
    enVvt: String,　//英文字幕
    zhVvt: String,　//中文字幕
    class: String, //类型
    difficulty: String, //难度
    status: Number  //发布状态：０未发布，１待发布，２已发布
});

//分页获取筛选条件下的所有文件
MaterialSchema.statics.get_all_file = function (options, page) {
    return this.find(options).skip((page-1)*10).limit(10).exec();
};

//获取筛选条件下的所有文件数量
MaterialSchema.statics.get_all_num = function (options) {
    return this.find(options).exec();
};

//根据id获取一条数据
MaterialSchema.statics.get_one = function (id) {
    return this.findOne({_id: id}).exec();
};

//删除一个文件
MaterialSchema.statics.delete = function (id) {
    return this.remove({_id: id}).exec();
};

//重命名
MaterialSchema.statics.rename = function (options, id) {
    return this.update({_id: id}, options).exec();
};


module.exports = db.conn.model('Material', MaterialSchema);