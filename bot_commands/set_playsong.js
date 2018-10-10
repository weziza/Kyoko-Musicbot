const discord = require('discord.js');
const rwm = require('../bot_module/read_write_modul');
const mpm = require('../bot_module/music_play_modul');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//------------------------------
const description = require('../bot_setting/description.json');
var enter_voice_channel = description.enter_voice_channel;
var pls_write_in_botchannel = description.pls_write_in_botchannel;
var botchannel_not_config = description.botchannel_not_config;
var only_jt_url = description.only_jt_url;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_playsong = commands_setting.set_playsong;
//------------------------------
var memberchannel;
//------------------------------
exports.run = async (bot,message)=>{

    //-----------------------------
    memberchannel = message.member.voiceChannel; //global member voiceChannel                    
    //-----------------------------
    var auth_id = message.author.id; // ist message author id
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    var url = message.content.split(' ')[1]; // gibt die url aus split prefix aus
    //------------------------------

    if(!memberchannel){return bot_MessChannel.send(wrap(enter_voice_channel));}
    else if (bot_MessChannel==null){
        message.delete();// lösche die gepostete messages        
        return message.channel.send(wrap(botchannel_not_config))}
    else if(message.channel.name!=botchannel){
        message.delete();// lösche die gepostete messages  
        return message.channel.send(wrap(pls_write_in_botchannel));}
    else if(!message.content.slice(prefix.length+set_playsong.length+1).startsWith("https://www.youtube.com")){
        var getNumber = message.content.slice(set_playsong.length+2);
        if(getNumber.search(/^[^a-z]+/)){
            return;
        }else{
            message.delete();// lösche die gepostete messages                 
            rwm.get_song_at_list(auth_id,message,bot,prefix+set_playsong,set_playsong.length+2,prefix,botchannel,memberchannel,set_playsong);
            mpm.get_song(memberchannel,message,bot_MessChannel);
            return;
        };             
    }else{
        var https = message.content.slice(prefix.length+set_playsong.length+1);                   
        mpm.play_song(memberchannel,message,bot_MessChannel,https);
        return;
    };
}
//------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}
//------------------------------

exports.help = {
    name: set_playsong
}