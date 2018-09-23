const sgm = require('../bot_module/music_play_modul');
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_searchsong = commands_setting.set_searchsong;
//------------------------------
exports.run = async (bot,message)=>{

    //-----------------------------
    var memberchannel = message.member.voiceChannel; //global member voiceChannel                    
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    var sucheVideo = message.content.split(' ').slice(1).join(" ");
    var url = message.content.split(' ')[1]; // gibt die url aus split prefix aus
    //-----------------------------

    if (!memberchannel) {
        return bot_MessChannel.send(wrap('Du musst erst ein Voice channel betreten'));
    }else{
        if (!sucheVideo){
            return bot_MessChannel.send(wrap('bitte schreib dazu nach was du suchst'));
        }else{   
            sgm.search_song(memberchannel,message,sucheVideo,bot_MessChannel,prefix);                    
            exports.get_url = function (url) {
                //console.log("videoInfo.url")
                sgm.play_song(memberchannel, message, bot_MessChannel, url);
            }; 
        }; 
    };  
};

exports.help = {
    name: set_searchsong
}

//------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}
//------------------------------