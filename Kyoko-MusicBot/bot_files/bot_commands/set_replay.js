const mpm = require('../bot_module/music_play_modul');
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_replay = commands_setting.set_replay;
//------------------------------
var memberchannel;
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
var language = setting.language;
//------------------------------
const lg = require('../language/language - '+language+'.json');
var enter_voice_channel = lg.enter_voice_channel;
var pls_write_in_botchannel = lg.pls_write_in_botchannel;
var botchannel_not_config = lg.botchannel_not_config;
//------------------------------


exports.run = async (bot,message)=>{

    //console.log(message)
    //-----------------------------
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //------------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    //------------------------------
    if (bot_MessChannel==null){
        message.delete();// lösche die gepostete messages        
        return bot_MessChannel.send(wrap(botchannel_not_config))}
    else if(message.channel.name!=botchannel){
        message.delete();// lösche die gepostete messages  
        return bot_MessChannel.send(wrap(pls_write_in_botchannel));
    }else{
        mpm.replay_song(message,bot_MessChannel,voiceConnection);
    }
}
//------------------------------
function wrap(text) {
    return '```http\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------
exports.help = {
    name: set_replay
}