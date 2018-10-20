const sgm = require('../bot_module/music_play_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_queue = commands_setting.set_queue;
//------------------------------
exports.run = async (bot,message)=>{
                  
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    sgm.queue(message,bot_MessChannel);
}

exports.help = {
    name: set_queue
}