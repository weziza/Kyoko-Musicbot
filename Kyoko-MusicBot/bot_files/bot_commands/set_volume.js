const discord = require('discord.js')
const sgm = require('../bot_module/music_play_modul')
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_volume = commands_setting.set_volume
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var prefix = setting.prefix
//------------------------------
exports.run = async (bot,message,VolumeNr)=>{
     
    if(message.content.startsWith(prefix+set_volume)){
        console.log(message.content)
        setTimeout(function(){
            message.delete()}, 250)}// lösche die gepostete messages
    //------------------------------ 
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id) //constant voiceConnection
    //------------------------------
    sgm.volume(message,VolumeNr,voiceConnection) //funktion Volume 
}

exports.help = {
    name: set_volume
}