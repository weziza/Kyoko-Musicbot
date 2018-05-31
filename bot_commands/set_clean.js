
const sgm = require('../bot_module/music_play_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_clean = setting.set_clean;
var botchannel = setting.botchannel;
//-----------------------------
exports.run = async (bot,message)=>{

    //-----------------------------
    var memberchannel = message.member.voiceChannel; //global member voiceChannel                    
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel

    sgm.clean_queue(memberchannel,message,bot_MessChannel);
}

exports.help = {
    name: set_clean
}