
const bmess = require('../bot_module/bot_message_modul');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var prefix = setting.prefix;
var MaxQueue = setting.MaxQueue;
var admin_id = setting.admin_id;
var botchannel = setting.botchannel;
var BotName = setting.BotName;
//------------------------------
var set_ping = setting.set_ping;
var set_mega = setting.set_mega;
var set_uhr = setting.set_uhr;
var set_hilfe = setting.set_hilfe;
var set_clean = setting.set_clean;
var set_queue = setting.set_queue;
var set_skip = setting.set_skip;
var set_volume = setting.set_volume;
var set_purge = setting.set_purge;
var set_pause = setting.set_pause;
var set_resume = setting.set_resume;
var set_leave = setting.set_leave;
var set_randomsong = setting.set_randomsong;
var set_songliste = setting.set_songliste;
var set_savesong = setting.set_savesong;
var set_deletesong = setting.set_deletesong;
var set_searchsong = setting.set_searchsong;
var set_playsong = setting.set_playsong;
//------------------------------



exports.run = async (bot,message)=>{
    
    //------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    
    bmess.InfoScreen(set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_mega,set_ping,bot_MessChannel,prefix,RandomColor,MaxQueue,BotName); //info ausgabe
}

exports.help = {
    name: set_hilfe
}