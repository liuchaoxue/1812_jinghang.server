var db = require('../config/dbConnection');
var Schema = db.mongoose.Schema;

var LessonSchema = new Schema({
    cms: {
        type: String,
        unique: true
    },
    materialId: {
        type: Schema.Types.ObjectId,
        ref: 'materials'
    },
    category: String,  //类别（iword/italk）
    status: Number
});

//获取所有课程
LessonSchema.statics.get_all_file = function (options, page) {
    return this.find(options).skip((page-1)*10).limit(10).exec();
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
