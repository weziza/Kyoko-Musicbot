const rwm = require('../bot_module/read_write_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_deletesong = setting.set_deletesong;
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//-----------------------------
exports.run = async (bot,message)=>{
                  
    //-----------------------------
    var auth = message.author.username; // ist message author
    var auth_id = message.author.id; // ist message author id
    var msg = message.content.toLowerCase();
    //-----------------------------
    rwm.delete_song(auth,auth_id,message,bot,prefix+set_deletesong,set_deletesong.length+2,botchannel);    
}

exports.help = {
    name: set_deletesong
}