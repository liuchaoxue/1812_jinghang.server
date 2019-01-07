const interval = 60 * 1000 * 5;
const lessonModel = require('../model/lessonModel');
const funModel = require('../model/funModel');
const talkModel = require('../model/talkModel');
const listenModel = require('../model/listenModel');

function Task(){
    this.status = {time: new Date(), status: 0}

}
Task.release_fun = ()=>{

};

Task.release_fun()

Task.run = ()=>{
  setInterval(()=>{


  },interval)
};