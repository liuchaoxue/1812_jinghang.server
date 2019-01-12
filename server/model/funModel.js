var db = require('../config/dbConnection');
var Schema = db.mongoose.Schema;

var FunSchema = new Schema({
    cms: String, //iword markdown　——只在iword显示
    class: String, //iword分类　——只在iword显示

    materialId: {
        type: Schema.Types.ObjectId,
        ref: 'Material'
    },           // ——不在iword中显示
    fun: String, //ifun分类　——只在ifun显示(电影，娱乐之类)
    label: Array,
    title: String,
    difficulty: String,
    category: String,  //类别（iword/italk）
    publicTime: Number, //发布时间(十位数的时间戳)
    status: Number,
    stage:  Number,  //生成文章状态 0未生成，１已生成
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

//获取所有课程
FunSchema.statics.get_all_file = function (options,page, num) {
    return this.find(options)
            .populate("materialId")
        .skip((page-1)*num).limit(num).sort({updateTime:-1}).exec();
};

//获取所有已发布
FunSchema.statics.get_all_public = function (options, page, num) {
    return this.find(options).sort({updateTime:-1}).exec();
};
FunSchema.statics.get_need_public_fun = function(time){
    return this.find({ status: 1, publicTime: {"$lte": time}}).populate('materialId').exec(); //todo 状态确认
};

//获取所有课程数量
FunSchema.statics.get_all_num = function (options) {
    return this.find(options).exec();
};

//删除一个课程
FunSchema.statics.delete = function (id) {
    return this.remove({_id: id}).exec();
};

//更新
FunSchema.statics.update_lesson = function (options, id) {
    return this.update({_id: id}, options).exec();
};

//根据id获取一个课程
FunSchema.statics.get_one = function (id) {
    return this.findOne({_id: id})
        .populate('materialId')
        .exec();
};

//关联查询（fileUrl，英文标题enTitle，中文字幕zhVvt，英文字幕enVvt，摘要abstract, label）
FunSchema.statics.get_all_pop = function (options) {
    return this.find(options)
        .populate('materialId')
        .sort({updateTime:-1}).exec();
};

module.exports = db.conn.model('Fun', FunSchema);
