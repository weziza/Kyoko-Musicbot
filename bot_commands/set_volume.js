const sgm = require('../bot_module/music_play_modul');
const index = require('../index');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_volume = setting.set_volume;


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