const sgm = require('../bot_module/music_play_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_queue = setting.set_queue;
var botchannel = setting.botchannel;
//-----------------------------
exports.run = async (bot,message)=>{
                  
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    sgm.queue(message,bot_MessChannel);
}

exports.help = {
    name: set_queue
}