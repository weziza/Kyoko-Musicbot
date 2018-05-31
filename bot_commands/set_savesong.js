const rwm = require('../bot_module/read_write_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_savesong = setting.set_savesong;
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//-----------------------------
exports.run = async (bot,message)=>{
                  
    //-----------------------------
    var auth = message.author.username; // ist message author
    var auth_id = message.author.id; // ist message author id
    var msg = message.content.toLowerCase();
    //-----------------------------
    rwm.save_song(auth,auth_id,message,bot,prefix+set_savesong,set_savesong.length+2,botchannel,msg);    
}

exports.help = {
    name: set_savesong
}