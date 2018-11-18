const spm = require('../bot_module/songprocess_modul')
const mpm = require('../bot_module/music_play_modul')
const bmc = require('../bot_module/bot_must_check.js')
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var botchannel = setting.botchannel
var prefix = setting.prefix
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_playsong = commands_setting.set_playsong
//------------------------------
var memberchannel
//------------------------------
exports.run = async (bot,message)=>{
    
    //-----------------------------
    voicechannel = message.member.voiceChannel //global member voiceChannel                    
    //-----------------------------
    var auth_id = message.author.id // ist message author id
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel) // bot schreibt in einen bestimmten angegebenen channel
    var url = message.content.split(' ')[1] // gibt die url aus split prefix aus
    //-----------------------------//-----------------------------//-----------------------------
    if(!bmc.user_in_voicechannel()){}else{return}
    if(!message.content.slice(prefix.length+set_playsong.length+1).startsWith("https://www.youtube.com")){
        var getNumber = message.content.slice(set_playsong.length+2)
        if(getNumber.search(/^[^a-z]+/)){
            return
        }else{
            //-----------------------------//-----------------------------//-----------------------------        
            message.delete()// lösche die gepostete messages
            spm.get_song_at_list(auth_id,message,bot,set_playsong.length+2,prefix,botchannel,set_playsong)
            setTimeout(function(){                   
                if(spm.temp==undefined){return}else{ //console.log(spm.temp,"     spm.temp")                   
                    if(getNumber<spm.temp.songlengthmsg){
                        return mpm.get_song(voicechannel,message,bot_MessChannel)
                    }else{return} //console.log(getNumber,"     return")                    
                }     
            }, 500)              
        }             
    }else{        
        message.delete()// lösche die gepostete messages
        var url = message.content.slice(prefix.length+set_playsong.length+1)                  
        return mpm.play_song(voicechannel,message,bot_MessChannel,url)        
    }
}
//------------------------------
function wrap(text) {
    return '```java\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------

exports.help = {
    name: set_playsong
}