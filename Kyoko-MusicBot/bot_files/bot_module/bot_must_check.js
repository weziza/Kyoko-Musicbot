const index = require("../index.js")
const mpm = require('./music_play_modul')
const bmess = require('./bot_message_modul')
//-----------------------------
const setting = require('../bot_setting/bot_setting.json')
var botchannel = setting.botchannel;
var language = setting.language
var bot_name = setting.bot_name
//-----------------------------
const lg = require('../language/language - '+language+'.json')
var enter_voice_channel = lg.enter_voice_channel
var botchannel_not_config = lg.botchannel_not_config
var pls_write_in_botchannel = lg.pls_write_in_botchannel
var no_music_play = lg.no_music_play
var no_voice_connect_message = lg.no_voice_connect_message
//---------------------------------------
const Thumbimage = require('../bot_images/Thumbimage.json')
var no_voice_connect = Thumbimage.no_voice_connect
var music_not_playing = Thumbimage.music_not_playing
//---------------------------------------
var messagex
var botx
var no = false 

    exports.run = function(message,bot){messagex=message,botx=bot}

    exports.no_botchannel = function(message,bot){  
        if (bot.channels.find(channel => channel.name === botchannel) == null&&no == false ){
            setTimeout(function(){                                  
                message.channel.send(wrap(botchannel_not_config))
                return console.log(" <-------> "+ "\n" +"cant find the channel "+botchannel+ "\n" +" <-------> ") 
            }, 500) 
            no = true  
            module.exports.temp={no:no}
        }else{
            no = false
            module.exports.temp={no:no}
        }
    }
 
    
    exports.write_bot_MessChannel = function(){  
        messagex=index.temp.message  
        botx=index.temp.bot        
        var write_bot_MessChannel = botx.channels.find(channel => channel.name === botchannel)         
        // bot schreibt in einen bestimmten angegebenen channel        
        if(messagex.channel.name!=botchannel){return messagex.channel.send(wrap2(pls_write_in_botchannel))}   
    }


    exports.user_in_voicechannel = function(){    
        messagex=index.temp.message  
        botx=index.temp.bot         
        //---------------------------------------
        var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
        var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
        var bot_MessChannel = botx.channels.find(channel => channel.name === botchannel)
        var voicechannel = messagex.member.voiceChannel 
        // console.log(voicechannel) 
        //-----------------------------    
        if(!voicechannel){return bmess.ambedMessage(enter_voice_channel,'```HTTP'+'\n' + "❌" + '```', bot_MessChannel,RandomColor,bot_name,no_voice_connect)}  

    }

    exports.check_it_play = function(){  
        messagex=index.temp.message  
        botx=index.temp.bot       
        //---------------------------------------
        var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
        var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
        var bot_MessChannel = botx.channels.find(channel => channel.name === botchannel)
        //-----------------------------        
        if(!mpm.temp.bot_playing){
            // return messagex.channel.send(wrap2(no_music_play))            
            return bmess.ambedMessage("؎",'```HTTP'+'\n' + no_music_play + '```', bot_MessChannel,RandomColor,bot_name,music_not_playing)
        }        
    }

//------------------------------
function wrap(text) {
    return '```java\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------
function wrap2(text) {
    return '```http\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------