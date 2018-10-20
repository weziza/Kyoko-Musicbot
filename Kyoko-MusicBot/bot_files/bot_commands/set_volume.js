const sgm = require('../bot_module/music_play_modul');
const index = require('../index');
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_volume = commands_setting.set_volume;
//------------------------------

exports.run = async (bot,message)=>{
    //------------------------------    
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    //------------------------------
    VolumeNr = index.VolumeNr
    sgm.volume(message,VolumeNr,voiceConnection);  // funktion Volume 
}

exports.help = {
    name: set_volume
}