
const sgm = require('../bot_module/music_play_modul')
//-----------------------------
const setting = require('../bot_setting/bot_setting.json')
var botchannel = setting.botchannel
//-----------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_url = commands_setting.set_url
//-----------------------------
exports.run = async (bot,message)=>{                
    //-----------------------------
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel) // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    sgm.see_url(message,bot_MessChannel)
}

exports.help = {
    name: set_url
}