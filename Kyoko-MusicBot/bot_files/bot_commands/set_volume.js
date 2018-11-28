const discord = require('discord.js')
const mpm = require('../bot_module/music_play_modul')
const bmc = require('../bot_module/bot_must_check.js')
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_volume = commands_setting.set_volume
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var prefix = setting.prefix
//------------------------------
exports.run = async (bot,message,VolumeNr)=>{
    
    //-----------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    //-----------------------------     
    if(message.content.startsWith(prefix+set_volume)){
        console.log(message.content)
        setTimeout(function(){
            message.delete()}, 250)}// lösche die gepostete messages
    //------------------------------ 
    if(!bmc.user_in_voicechannel()){}else{return}
    if(!bmc.check_it_play()){}else{return}
    mpm.volume(VolumeNr,voiceConnection) //funktion Volume 
}

exports.help = {
    name: set_volume
}