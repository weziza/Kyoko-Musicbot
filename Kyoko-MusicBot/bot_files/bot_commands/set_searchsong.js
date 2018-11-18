const mpm = require('../bot_module/music_play_modul'),
    bmc = require('../bot_module/bot_must_check.js')
//------------------------------  
const setting = require('../bot_setting/bot_setting.json')  
var botchannel = setting.botchannel
var prefix = setting.prefix
var language = setting.language
//------------------------------
const lg = require('../language/language - '+language+'.json')
var looking_for = lg.looking_for
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_searchsong = commands_setting.set_searchsong
//------------------------------
exports.run = async (bot,message)=>{
    //-----------------------------
    voicechannel = message.member.voiceChannel //global member voiceChannel                    
    //-----------------------------
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel) // bot schreibt in einen bestimmten angegebenen channel
    var sucheVideo = message.content.split(' ').slice(1).join(" ")
    var url = message.content.split(' ')[1] // gibt die url aus split prefix aus
    //-----------------------------//-----------------------------//-----------------------------
    if(!bmc.user_in_voicechannel()){}else{return}
    if (!sucheVideo){
        return bot_MessChannel.send(wrap(looking_for))
    }else{
    //-----------------------------//-----------------------------//-----------------------------    
        mpm.search_song(sucheVideo,bot_MessChannel)
        // bot_MessChannel.send({files: ["./bot_stuff/st_files/loading.gif"]})          
        setTimeout(function(){ 
            if (mpm.temp.vieo==undefined){return}else{  
                return mpm.play_song(voicechannel,message,bot_MessChannel, mpm.temp.vieo)                                           
            }                    
        }, 2000)   
    } 
 
}
//------------------------------
exports.help = {
    name: set_searchsong
}
//------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------