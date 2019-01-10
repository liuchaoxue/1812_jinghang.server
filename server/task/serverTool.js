
const axios = require('axios');

function getDifficulty(text, duration){
    return new Promise((resolve, reject)=> {
        axios.post('http://212.64.22.231:12000/SentenceComplexity',{text: text, duration: duration})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                resolve(false)
            });
    })

}


module.exports = {
    getDifficulty: getDifficulty
};
