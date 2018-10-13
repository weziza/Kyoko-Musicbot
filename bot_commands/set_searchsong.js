const sgm = require('../bot_module/music_play_modul');
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
var bot_name = setting.bot_name;
//------------------------------
var language = setting.language;
//------------------------------
const lg = require('../language/language - '+language+'.json');
var enter_voice_channel = lg.enter_voice_channel;
var pls_write_in_botchannel = lg.pls_write_in_botchannel;
var botchannel_not_config = lg.botchannel_not_config;
var looking_for = lg.looking_for;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_searchsong = commands_setting.set_searchsong;
//------------------------------
const index = require("../index");
var bot = index.bot; 
//import var bot aus script index.js
//------------------------------
var memberchannel
//------------------------------
exports.run = async (bot,message)=>{

    //-----------------------------
    var memberchannel = message.member.voiceChannel; //global member voiceChannel                    
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    var sucheVideo = message.content.split(' ').slice(1).join(" ");
    var url = message.content.split(' ')[1]; // gibt die url aus split prefix aus
    //-----------------------------

    if(!memberchannel){return bot_MessChannel.send(wrap(enter_voice_channel));}
    else if (bot_MessChannel==null){
        message.delete();// lösche die gepostete url messages        
        return message.channel.send(wrap(botchannel_not_config))}
    else if(message.channel.name!=botchannel){
        message.delete();// lösche die gepostete url messages  
        return message.channel.send(wrap(pls_write_in_botchannel));} 
    else{
        if (!sucheVideo){
            return bot_MessChannel.send(wrap(looking_for));
        }else{
            sgm.search_song(message,sucheVideo,bot_MessChannel,prefix);                    
            exports.get_url = function (url) {
                sgm.play_song(memberchannel, message, bot_MessChannel, url);
            }; 
        }; 
    };  
};
//------------------------------
exports.help = {
    name: set_searchsong
}
//------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}
//------------------------------