const  {exec } = require('child_process')

function loading(url, id){
    let cmd = 'you-get -o ./tmp/'+id +' '+ url;
    console.log(cmd);
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        console.log('================out'+stdout)
        console.log('================err'+stderr)
        console.log('ok')
        process.send('close');
        // process.exit()
    });
}
process.on('message', function(data){
    if(data =='close'){
        return process.exit()
    }
    loading(data.url, data.id)

    // process.send(data);
});




