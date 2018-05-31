const rwm = require('../bot_module/read_write_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_randomsong = setting.set_randomsong;
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//-----------------------------
exports.run = async (bot,message)=>{
                  
    //-----------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    var memberchannel = message.member.voiceChannel; //global member voiceChannel
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    var auth_id = message.author.id; // ist message author id
    //-----------------------------
    return rwm.Random_song(auth_id,message,bot,prefix+set_randomsong,prefix,botchannel,memberchannel,bot_MessChannel);    
}

exports.help = {
    name: set_randomsong
}