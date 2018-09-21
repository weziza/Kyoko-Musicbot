const rwm = require('../bot_module/read_write_modul');
const sgm = require('../bot_module/music_play_modul');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//------------------------------
var set_playsong = setting.set_playsong;
//------------------------------

exports.run = async (bot,message)=>{

    //-----------------------------
    var memberchannel = message.member.voiceChannel; //global member voiceChannel                    
    //-----------------------------
    var auth_id = message.author.id; // ist message author id
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    var url = message.content.split(' ')[1]; // gibt die url aus split prefix aus
    //------------------------------

    //console.log(bot_MessChannel)

    if(!memberchannel){return bot_MessChannel.send(wrap('Du musst erst ein Voice channel betreten'));}
    else if (bot_MessChannel==null){
        message.delete();// lösche die gepostete url messages  
        return message.channel.send(wrap("bot channel not config"))}
    else if(message.channel.name!=botchannel){
        message.delete();// lösche die gepostete url messages  
        return message.channel.send(wrap("please write in the bot channel"));}
    else if(!message.content.slice(prefix.length+set_playsong.length+1).startsWith("https://www.youtube.com")){
        var getNumber = message.content.slice(set_playsong.length+2);
        if(getNumber.search(/^[^a-z]+/)){
            return;
        }else{
            rwm.get_song_at_list(auth_id,message,bot,prefix+set_playsong,set_playsong.length+2,prefix,botchannel,memberchannel,set_playsong);
            sgm.get_song(memberchannel,message,bot_MessChannel);
            return;
        };               
    }else{                
        var https = message.content.slice(prefix.length+set_playsong.length+1);                   
        sgm.play_song(memberchannel,message,bot_MessChannel,https);
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