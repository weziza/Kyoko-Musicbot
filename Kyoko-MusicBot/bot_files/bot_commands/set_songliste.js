const spm = require('../bot_module/songprocess_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_songliste = commands_setting.set_songliste;
//------------------------------
exports.run = async (bot,message)=>{
    message.delete();// lösche die gepostete messages               
    //-----------------------------
    var auth = message.author.username; // ist message author    
    var auth_id = message.author.id; // ist message author id
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------
    return spm.songliste(auth,auth_id,message,bot,botchannel);       
}

exports.help = {
    name: set_songliste
}