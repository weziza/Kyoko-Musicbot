const rwm = require('../bot_module/read_write_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_songliste = setting.set_songliste;
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//-----------------------------
exports.run = async (bot,message)=>{
                  
    //-----------------------------
    var auth = message.author.username; // ist message author
    var auth_id = message.author.id; // ist message author id
    //-----------------------------
    return rwm.songliste(auth,auth_id,message,bot,botchannel);    
}

exports.help = {
    name: set_songliste
}