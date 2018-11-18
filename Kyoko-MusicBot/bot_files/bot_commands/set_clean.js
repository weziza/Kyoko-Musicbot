
const sgm = require('../bot_module/music_play_modul');
const bmc = require('../bot_module/bot_must_check.js')
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
//-----------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_clean = commands_setting.set_clean;
//-----------------------------
exports.run = async (bot,message)=>{                
    //-----------------------------
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    if(!bmc.user_in_voicechannel()){}else{return}
    if(!bmc.check_it_play()){}else{return}
    sgm.clean_queue(message,bot_MessChannel);
}

exports.help = {
    name: set_clean
}