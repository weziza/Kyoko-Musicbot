const sgm = require('../bot_module/music_play_modul');
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
//-----------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_leave = commands_setting.set_leave;
//-----------------------------
exports.run = async (bot,message)=>{
    
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    bot_MessChannel.bulkDelete(100);  
    //------------------------------
    var VolumeNr =  1;
    exports.VolumeNr = VolumeNr;    
    sgm.leave(bot_MessChannel,message);
    
}

exports.help = {
    name: set_leave
}