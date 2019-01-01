var db = require('../config/dbConnection');
var Schema = db.mongoose.Schema;

var LabelSchema = new Schema({
    label: String,
    category: String,  //类别（iword/italk）

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

//获取所有标签
LabelSchema.statics.get_all_label = function (pram) {
    return this.find(pram).sort({updateTime:-1}).exec();
};

//删除一个文件
LabelSchema.statics.delete = function (id) {
    return this.remove({_id: id}).exec();
};

//重命名
LabelSchema.statics.rename = function (options, id) {
    return this.update({_id: id}, options).exec();
};

// //获取所有文件数量
// LabelSchema.statics.get_all_num = function () {
//     return this.find().exec();
// };

//根据id获取一条数据
LabelSchema.statics.get_one = function (id) {
    return this.findOne({_id: id}).exec();
};

module.exports = db.conn.model('Label', LabelSchema);
