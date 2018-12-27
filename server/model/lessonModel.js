var db = require('../config/dbConnection');
var Schema = db.mongoose.Schema;

var LessonSchema = new Schema({
    cms: String,
    materialId: {
        type: Schema.Types.ObjectId,
        ref: 'materials'
    },
    title: String,
    difficulty: String,
    category: String,  //类别（iword/italk）
    class: String,
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
LessonSchema.statics.get_all_file = function (options, page, num) {
    return this.find(options).skip((page-1)*num).limit(num).sort({updateTime:-1}).exec();
};

//获取所有已发布
LessonSchema.statics.get_all_public = function (options, page, num) {
    return this.find(options).sort({updateTime:-1}).exec();
};

//获取所有课程数量
LessonSchema.statics.get_all_num = function (options) {
    return this.find(options).exec();
};

//删除一个课程
LessonSchema.statics.delete = function (id) {
    return this.remove({_id: id}).exec();
};

//更新
LessonSchema.statics.update_lesson = function (options, id) {
    return this.update({_id: id}, options).exec();
};

//根据id获取一个课程
LessonSchema.statics.get_one = function (id) {
    return this.findOne({_id: id}).exec();
};

module.exports = db.conn.model('Lesson', LessonSchema);
