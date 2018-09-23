const sgm = require('../bot_module/music_play_modul');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_pause = commands_setting.set_pause;
//------------------------------


exports.run = async (bot,message)=>{

    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    //-----------------------------

    sgm.pause(message,prefix,voiceConnection,bot_MessChannel); 
}

exports.help = {
    name: set_pause
}