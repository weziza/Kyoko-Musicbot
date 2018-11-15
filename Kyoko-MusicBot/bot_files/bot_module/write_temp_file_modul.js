const fs = require('fs'),
    index = require('../index.js'),
    mpm = require('./music_play_modul.js'),
    bmm = require('./bot_message_modul.js'),
    spm = require('./songprocess_modul.js'),
    slm = require('./songlist_modul.js')

const setting = require('../bot_setting/bot_setting.json')  
var write_testing_file = setting.write_testing_file  

var all = [],
    data 

exports.run = async function(){
    if (write_testing_file){ 
        all = []       
        all.push(index.table)
        all.push(bmm.table)
        all.push(mpm.table) 
        all.push(spm.table)
        all.push(slm.table)
        
        data = JSON.stringify(all, null, 4);
        fs.writeFileSync('./temp/variable_testing.json',data), err =>{if (err){throw err}}     
    }else{
        all = [] 
        all.push("write_testing_file")

        data = JSON.stringify(all, null, 4);
        fs.writeFileSync('./temp/variable_testing.json',data), err =>{if (err){throw err}} 
    }
}
