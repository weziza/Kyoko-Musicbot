const bmess = require('../bot_module/bot_message_modul')
const mpm = require('../bot_module/music_play_modul')
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var prefix = setting.prefix,
    MaxQueue = setting.max_queue,
    admin_id = setting.admin_id,
    botchannel = setting.botchannel,
    bot_name = setting.bot_name,
    help_send_privat = setting.help_send_privat
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_ping = commands_setting.set_ping,
    set_mega = commands_setting.set_mega,
    set_uhr = commands_setting.set_uhr,
    set_hilfe = commands_setting.set_hilfe,
    set_clean = commands_setting.set_clean,
    set_queue = commands_setting.set_queue,
    set_skip = commands_setting.set_skip,
    set_volume = commands_setting.set_volume,
    set_purge = commands_setting.set_purge,
    set_pause = commands_setting.set_pause,
    set_resume = commands_setting.set_resume,
    set_leave = commands_setting.set_leave,
    set_randomsong = commands_setting.set_randomsong,
    set_songliste = commands_setting.set_songliste,
    set_savesong = commands_setting.set_savesong,
    set_deletesong = commands_setting.set_deletesong,
    set_searchsong = commands_setting.set_searchsong,
    set_playsong = commands_setting.set_playsong,
    set_url = commands_setting.set_url
//------------------------------
exports.run = async (bot,message)=>{
    message.delete()// lösche die gepostete messages
    //------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel) // bot schreibt in einen bestimmten angegebenen channel
    var author_MessChannel = message.author // bot schreibt an author
    if (help_send_privat==true){
        return bmess.InfoScreen(set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_mega,set_ping,set_url,author_MessChannel,prefix,RandomColor,MaxQueue,bot_name) //info ausgabe
    }else{
        return bmess.InfoScreen(set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_mega,set_ping,set_url,bot_MessChannel,prefix,RandomColor,MaxQueue,bot_name) //info ausgabe
    }
}

exports.help = {
    name: set_hilfe
}