const sgm = require('../bot_module/music_play_modul');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_resume = commands_setting.set_resume;
//------------------------------

exports.run = async (bot,message)=>{

    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    //-----------------------------
    sgm.resume(message,prefix,voiceConnection,bot_MessChannel);
}

exports.help = {
    name: set_resume
}