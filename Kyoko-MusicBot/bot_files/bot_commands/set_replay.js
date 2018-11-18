const mpm = require('../bot_module/music_play_modul');
const bmc = require('../bot_module/bot_must_check.js')
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_replay = commands_setting.set_replay;
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
//------------------------------
exports.run = async (bot,message)=>{

    //-----------------------------
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //------------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); //constant voiceConnection
    //------------------------------
    if(!bmc.user_in_voicechannel()){}else{return}
    if(!bmc.check_it_play()){}else{return}    
    mpm.replay_song();
    
}
//------------------------------
function wrap(text) {
    return '```http\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------
exports.help = {
    name: set_replay
}