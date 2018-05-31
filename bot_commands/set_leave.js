

const sgm = require('../bot_module/music_play_modul');
const setting = require('../bot_setting/bot_setting.json');
var set_leave = setting.set_leave;
var botchannel = setting.botchannel;

exports.run = async (bot,message)=>{
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel  
    //------------------------------
    var VolumeNr =  1;
    exports.VolumeNr = VolumeNr;    
    sgm.leave(bot_MessChannel,message);
}

exports.help = {
    name: set_leave
}