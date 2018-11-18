const sgm = require('../bot_module/music_play_modul');
const bmc = require('../bot_module/bot_must_check.js')
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_pause = commands_setting.set_pause;
//------------------------------
exports.run = async (bot,message)=>{

    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    //-----------------------------
    if(!bmc.user_in_voicechannel()){}else{return}
    if(!bmc.check_it_play()){}else{return}
    sgm.pause(voiceConnection,bot_MessChannel); 
}

exports.help = {
    name: set_pause
}