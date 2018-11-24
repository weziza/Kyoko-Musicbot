const spm = require('../bot_module/songprocess_modul')
const bmc = require('../bot_module/bot_must_check.js')
//-----------------------------
const setting = require('../bot_setting/bot_setting.json')
var botchannel = setting.botchannel
var prefix = setting.prefix
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_randomsong = commands_setting.set_randomsong
//------------------------------
exports.run = async (bot,message)=>{                  
    //-----------------------------
    // const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id) //constant voiceConnection
    var in_voicechannel = message.member.voiceChannel //global member voiceChannel
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel) // bot schreibt in einen bestimmten angegebenen channel
    var auth_id = message.author.id // ist message author id    
    //-----------------------------
    // if(bmc.check_mess_bot()){}else{return} 
    
    if(!bmc.user_in_voicechannel()){}else{return}
    return spm.Random_song(auth_id,message,bot,prefix,set_randomsong,botchannel,in_voicechannel,bot_MessChannel)    
}

exports.help = {
    name: set_randomsong
}