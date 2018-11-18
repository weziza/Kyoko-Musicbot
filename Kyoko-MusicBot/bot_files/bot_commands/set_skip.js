const sgm = require('../bot_module/music_play_modul');
const bmc = require('../bot_module/bot_must_check.js')
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_skip = commands_setting.set_skip;
//------------------------------
exports.run = async (bot,message)=>{                  
    //-----------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    if(!bmc.user_in_voicechannel()){}else{return}
    if(!bmc.check_it_play()){}else{return}
    sgm.skip();
}

exports.help = {
    name: set_skip
}