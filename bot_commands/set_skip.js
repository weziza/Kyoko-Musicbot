const sgm = require('../bot_module/music_play_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_skip = setting.set_skip;
var botchannel = setting.botchannel;
//-----------------------------
exports.run = async (bot,message)=>{
                  
    //-----------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    sgm.skip(message,bot_MessChannel,voiceConnection);
}

exports.help = {
    name: set_skip
}