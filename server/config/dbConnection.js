var mongoose = require('mongoose-q')(require('mongoose'));
var settings = require('./config');
module.exports = {
    mongoose:mongoose,
    conn: mongoose.createConnection(settings.conn),
    close: function(){
        mongoose.connection.close();
    }
};