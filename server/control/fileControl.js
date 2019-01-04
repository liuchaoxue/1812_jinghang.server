var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var UUID = require('node-uuid');
var Vvt = require('../util/webGetVvt');
var Video = require('../util/webGetVideo');
var Audio = require('../util/webGetAudio');
var FileModel = require('../model/fileModel');
var MaterialModel = require('../model/materialModel');
var settings = require('../config/config');

var Promise = require('promise');


let File = {};

File._main = (req, res) => {
    console.log('媒体中心');
    res.send({code: 0, data: '媒体中心'});
};

File.ted_handle = (req, res) => {
    let videoInfo = JSON.parse(req.body.data);
    //爬虫穿过来的示例数据
    // var videoInfo = {
    //     "content": "Nadjia Yousif: Why you should treat the tech you use at work like a colleague | TED Talk",
    //     "url": "https://www.ted.com/talks/nadjia_yousif_why_you_should_treat_the_tech_you_use_at_work_like_a_colleague",
    //     "description": "Imagine your company hires a new employee and then everyone just ignores them, day in and day out, while they sit alone at their desk getting paid to do nothing. This situation actually happens all the time -- when companies invest millions of dollars in new tech tools only to have frustrated employees disregard them, says Nadjia Yousif. In this fun and practical talk, she offers advice on how to better collaborate with the technologies in your workplace -- by treating them like colleagues.",
    //     "interactionCount": "623054",
    //     "uploadDate": "2018-12-12T15:54:30+00:00",
    //     "vvt": "ted://talks/27692?source\\u003dfacebook"
    // };
    try{
        loadingTedVVT(videoInfo, (id) => {
            loadingTedVideo(videoInfo, id)
        });
    }catch (e) {
        console.log(e);
    }
    res.send({code: 0, data: "成功访问回调post接口"})
};

File.bbc_handle = (req, res) => {
    let audioInfo = JSON.parse(req.body.data);
    // let audioInfo = {
    //     "title":"时间胶囊 Time capsules",
    //     "text":{
    //         "text":"音频下载[点击右键另存为] \nHello, I’m Rob. Welcome to 6 Minute English. I’m joined today, at the start of a brand new year, by Neil.大家好，欢迎收听六分钟英语节目。我是主持人Rob。新年第一讲开始啦，本期嘉宾是Neil。Hello, Rob! I’m really looking forward to 2015, but I have to say that last year was great.So great I’m thinking about creating my own time capsule.Rob,你好~ 新年确实值得期待，不过过去的一年我必须承认过得很棒。以至于我正在构思做我自己的时间胶囊。Really? A time capsule? You mean a kind of box or container where you can store objects and information so that people in the future -yourself included - will know how we lived at this particular time?真的么？时间胶囊？就是用盒子或者容器将某些物品保存好，以便将来的人，也包括将来的你自己来知道这个时期的生活。That’s it! And I’m already collecting items. My old mobile phone which I don’t use anymore. And a woolly jumper with a snowman on it my granny gave me that I never wear…就是这个！我已经在手机物品了，比如我不会再用的旧手机，还有一件奶奶送给我却从没穿过的织着雪人的羊毛套衫。You never wear?从没穿过？It’s a pretty silly jumper, Rob. She said it’s to remind me of how much she loves me.Remind, which means, makes me remember - but all it makes me think of is that she still treats me like a child!I’ll include the Christmas card which came with it!恩这个针织套衫有点傻，奶奶说是为了让我想起她对我浓浓的爱。remind意思是让我们记起。但其实我看到这件针织衫只会觉得奶奶仍然把我当孩子，我要把针织衫一起的圣诞贺卡也一起放在时间胶囊里。Well, you’ve got to choose the items you wish to keep as a memory of our time very carefully. It’s a historical record - that usually means a piece of writing or a narrative of events at a particular time.Well, let’s discuss time capsules and vocabulary related to memory. But first, a question to test your knowledge of time capsules.The International Time Capsule Society is based at Oglethorpe University in Atlanta, in the US, and it studies these artefacts.According to this organisation, how many time capsules are estimated to exist in the world today? Is it:a)up to 15,000b)up to 150,000 orc)up to 1,500,000好吧，你要仔细挑选一下物品，毕竟是作为这个时代的纪念。这是一种时代的回忆，意思是它能描述出特定时代的生活或者事件。好的，这期节目就是关于时间胶囊，并且会介绍关于回忆的词语。节目开始先回答一个问题看看你对时间胶囊了解多少。国际时间胶囊协会总部设立在美国亚特兰大的奥格尔普索大学，他们研究了一些时间胶囊。根据这项研究，世界上现存的时间胶囊有多少个？选项有：a）接近1万5千个b）接近15万个c）接近150万个I’m gonna go for (a) 15,000.那我选a）接近1万5千个。OK, up to 15,000.好的，你的答案是一万五千个。That’s the one.没错。OK. Well, as usual, you’ll have the answer to that question at the end of the programme. Right, now, let’s talk more about time capsules. One of them was in the news in the last couple of weeks. A capsule was found in a public building in Boston.好的，和平时一样，答案将在本期节目结束之前揭晓。现在，一起来聊聊时间胶囊吧。首先是一则发生在前几周的新闻，在波士顿一栋公共建筑中人们发现了时间胶囊。Ah, I’ve heard about this. Historians believe it was put there by Samuel Adams and Paul Revere, and other American revolutionaries in the 18th century!我听到过这个新闻，历史学家认为是由Samuel Adams和Paul Revere以及一些18世纪的美国革命家一起放置的。OK. Let’s listen to BBC reporter Rajini Vaidyanathan. Can you tell me exactly where this time capsule was hidden?好的，来听一下BBC记者Rajini Vaidyanathan怎么说的吧，具体这个时间胶囊是藏在哪里了呢？【Rajini Vaidyanathan, BBC reporter in Washington】It was during repair work at the Massachusetts State House in Boston that the time capsule was discovered hidden in the cornerstone. It’s thought the time capsule was first placed there in the 1795, when the building was constructed.Officials believe it contains old coins and newspapers which could have deteriorated over time.【Rajini Vaidyanathan，BBC驻华盛顿记者】在波士顿的马萨诸塞州州议会大楼，这里当时正在进行修复工作，然后在大楼基石里发现了时间胶囊。因此推测时间胶囊的时间为1795年，也就是这座大楼的建造时间。工作人员认为其中应该有当时的硬币或者报纸这类的在经过一段时间后腐化消失的物品。Ah, the time capsule was hidden in the cornerstone,which is a stone representing the starting place in the construction of a monumental building. Usually it has the date carved on it.啊，原来时间胶囊是藏在基石里的。基石也就是建筑建设地点的标志性石头，上面通常刻有建造日期。Yes the time capsule’s items date from over 200 years ago, so the historians are concerned about opening it.The newspapers particularly might have deteriorated, decayed or decomposed over time. 是的，这个时间胶囊是200多年前的，所以历史学家很关注它里面的物品。报纸很有可能会随着时间的推移而腐化分解消失。Paper doesn’t last long. But my old mobile phone - the one I’m going to put in my own time capsule -will be eternal, it means it will exist forever! And the historians of the future will be grateful!是啊，纸质物品很容易消失，但是我准备放在我时间胶囊里的旧手机应该是可以一直保存的，eternal意思是长久存在。是的，未来的历史学家一定会开心的。Well, if you want to make the historians happy, put things which are current in your life and things you actually use in your time capsule.There are famous capsules to be opened: the American company Westinghouse created two of them.One for the 1939 New York World’s Fair and the other for the same event in 1964.好吧，如果你想让未来的历史学家高兴，应该放些你生活里必备常用的东西在时间胶囊里。在著名的时间胶囊里，将要打开的有两个来自于美国西屋公司。一个是1937年纽约世界博览会，一个是1964年的纽约世界博览会。And when are they going to open it?什么时候打开呢？In the 25th century! 在25世界！Wow! Well, that’s it, Rob. I’m going home and I’m going to start working on my own time capsule!哇！好吧，Rob，我要回家收拾我自己的时间胶囊啦。Good. I’m glad to see you’re so enthusiastic, Neil. But be careful not to make the mistake these guys in the Writtle Junior School here in England made.They put their items in a box 25 years ago and they buried the capsule in the garden.好啊，看到你这么亢奋我很开心。但是要小心，不要再犯错误，像英国Writtle初中学校的那些人一样。他们在25年前把他们的物品放入时间胶囊，埋在公园里。And what happened to it? It isn’t centuries later but it must be interesting for these people who are now adults to see what’s inside.然后呢？在几十年后，他们已经成年后，打开这个时间胶囊多有趣！Well, it would have been interesting. But it didn’t happen.Listen to Headteacher Nick Taylor and tell me why they didn’t open their time capsule.是啊，本该是非常有意义的。可惜他们并没有达成这个愿望。来听听校长Nick Taylor怎么说，为什么他们没能打开自己的时间胶囊呢？【Nick Taylor, Writtle School Headteacher】There were letters in it, coins, various things so we called in Writtle Heritage and they had a good explore around the garden with their metal detectors, and they couldn’t find any evidence of it. I think we’ve dug about three holes around our school garden but we had to stop because we were slowly destroying it.【Nick Taylor，Writtle学校的校长】时间胶囊里有信件、硬币和各种各样的东西，我们称之为Writtle遗产。他们用金属探测器在花园里寻扎，却根本探测不到任何信息。我们已经在学校花园里挖了三个洞，再挖下去花园就没了。They forgot where they buried it!他们忘记了埋在哪里！Yes. And they used metal detectors - electronic devices which can find metallic objects underground - and even so they couldn’t find their time capsule!And before I forget, let’s go back to the question I asked at the beginning of the programme.是的，他们使用了金属探测器，就是一种可以找到地下金属物品的点子装置，却仍然一无所获，找不到时间胶囊。好吧，在我忘记问题之前，我们来揭晓答案吧。You asked how many time capsules are estimated to exist in the world today.你问我当今世界上有多少个时间胶囊。Yes, and the options were up to 15,000, up to 150,000 or up to 1,500,000. And you said...是的，选项是一万五千个，十五万个和一百五十万个。Yes, I said up to 15,000.我选了一万五千个。And this is the right answer!你答对了！Hurrah!太棒啦！Well done! Yes, the International Time Capsule Society has set up a registry of time capsules, and it estimates there are 10,000 to 15,000 time capsules worldwide. And the organisation believes that more than 80% of all time capsules are lost and will not be opened on their intended date.是啊，根据国际时间胶囊协会成立的时间胶囊登记估算出全世界的时间胶囊应该有一万到一万五千个。并且协会认为80%的时间胶囊都找不到埋藏地点，无法在预估时间打开。Well, I will remember where I kept mine. That’s for sure.好的，我一定会记住的我的埋在哪儿了。Good for you. Well, that’s it from us for the moment.We’ve been talking about time and... we’ve run out of it. But let’s just remember some of the words used today.是啊，记住比较好，现在时间到了。这期节目我们探讨了时间，啊我们已经超时了。来回顾一下今天所学的词语吧。time capsule 时间胶囊That’s it for today. Do log on to bbclearningenglish.com to find more 6 Minute English programmes. And we wish you all a Happy New Year! Bye bye!今天节目就到这里了，下期再会。Bye!再见本栏目更多同类内容 \n 将本页收藏到： \n \n 上一篇：圣诞休战 The Christmas Truce \n 下一篇：是欺凌还是竞争？ Bullying or normal competition? \n \n ※相关链接※ \n ·上班时间打瞌睡 Sleeping on the job"
    //     },
    //     "url":"http://s2.hxen.com/m2/tingli/six/56160.mp3"
    // };

    try{
        loadingBbcVVT(audioInfo, (data) => {
            loadingBbcAudio(data, () => {
                console.log('bbc音频获取成功')
            })
        })
    }catch (e) {
        console.log(e);
    }
    res.send({code: 0, data: "成功访问回调post接口"})
};

File._upload = (req, res) => {

    let vvt;
    if(req.body.vvt){
        vvt = req.body.vvt;
    }else {
        vvt = '';
    }

    let promiseArr = [];
    for(let i=0;i<req.files.length;i++){
        let promise = new Promise((resolve) => {
            let nameArr = req.files[i].originalname.split('.');
            let format = nameArr[nameArr.length - 1];
            let fileUuid = UUID.v1();
            let dest = path.join('data', 'upload', fileUuid + '.' +  format);
            fs.rename(req.files[i].path, './public/' + dest, (err) => {
                if(err) {
                    console.log(err);
                    return resolve(err);
                }
                let pram = {
                    fileName: req.files[i].originalname,
                    fileUrl: settings.host + dest,
                    vvt: vvt,
                    source: 'upload'
                };
                console.log(pram);
                let newFile = new FileModel(pram);
                newFile.save(function (err, data) {

                    if(err){
                        return console.log('错误:'+ err)
                    }


                    let options = {
                        fileId: data._id,
                        fileUrl: data.fileUrl,
                        zhTitle: req.files[i].originalname
                    };

                    let newMaterial = new MaterialModel(options);
                    newMaterial.save((err, result) => {
                        return resolve({file: data, material: result});
                    });
                });
            })
        });
        promiseArr.push(promise);
    }
    Promise.all(promiseArr).then((data) => {
        console.log('文件上传完成', data);
        res.send({code: 0, data: data});
    });
};


File.ewa_handle = (req, res) => {
    let promiseArr = [];
    let info = req.body;
    for(let i=0;i<req.files.length;i++){
        let promise = new Promise((resolve) => {
            let nameArr = req.files[i].originalname.split('.');
            let format = nameArr[nameArr.length - 1];
            let fileUuid = UUID.v1();
            let dest = path.join('data', 'ewa', fileUuid + '.' +  format);
            fs.rename(req.files[i].path, './public/' + dest, (err) => {
                if(err) {
                    console.log(err);
                    return resolve(err);
                }
                let pram = {
                    fileName: req.files[i].originalname,
                    fileUrl: settings.host + dest,
                    source: 'ewa'
                };
                console.log(pram);
                let newFile = new FileModel(pram);
                newFile.save(function (err, data) {

                    if(err){
                        return console.log('错误:'+ err)
                    }

                    let options = {
                        fileId: data._id,
                        fileUrl: data.fileUrl,
                        source: 'ewa',
                        zhTitle: info.title,
                        enVvt: info.enVvt,
                        zhVvt: info.zhVvt,
                        enVvtLen: info.enVvtLen,
                        zhVvtLen: info.zhVvtLen,
                        difficulty: info.difficulty
                    };

                    let newMaterial = new MaterialModel(options);
                    newMaterial.save((err, result) => {
                        return resolve({file: data, material: result});
                    });
                });
            })
        });
        promiseArr.push(promise);
    }
    Promise.all(promiseArr).then((data) => {
        console.log('文件上传完成', data);
        res.send({code: 0, data: data});
    });
};

File._getall = (req, res) => {
    FileModel.get_all_file().then((data) => {
        res.send({code: 0, data: data});
    })
};


File._getone = (req, res) => {
    let id = req.query.fileId;
    if(id){
        FileModel.get_one(id).then(data => {
            return res.send({code: 0, data: data});
        })
    }else {
        return res.send({code: 1, data: '缺少lessonId参数'})
    }
};

function loadingBbcVVT(audioInfo, cb) {

    let url = audioInfo.url;
    let id = url.split('/').pop().split('.')[0];
    let dest = path.join('./public', 'data', 'bbc', id);
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    audioInfo.dest = dest;
    audioInfo.id = id;
    Vvt.getBbcVvt(audioInfo, () => {
        console.log('bbc字幕获取成功');
        cb(audioInfo);
    })
}

function loadingBbcAudio(data, cb) {
    Audio.getTedAudio(data, () => {
        cb();
    })
}

function loadingTedVVT(videoInfo, cb) {
    var id = videoInfo.vvt.split(/\/|\?/)[3];
    var url = path.join('./public','data', 'ted', id);
    if (!fs.existsSync(url)) {
        fs.mkdirSync(url);
    }
    Vvt.getTedVvt(id, url, () => {
        console.log('字幕获取完成');
        cb(id);
    })
}

function loadingTedVideo(videoInfo, id) {
    videoInfo.id = id;
    Video.getTedVideo(videoInfo, () => {
        console.log('视频获取完成')
    })
}

router.get('/', File._main);
router.post('/ted/_handel', File.ted_handle); //处理web ted来源的文件
router.post('/bbc/_handel', File.bbc_handle); //处理bbc来源文件
router.post('/_upload', File._upload); //上传媒体文件
router.get('/_getall', File._getall); //获取所有上传文件
router.get('/_getone', File._getone); //获取单个ｆｉｌｅ文件

router.post('/ewa/_handel', File.ewa_handle); //获取ewa视频

module.exports = router;