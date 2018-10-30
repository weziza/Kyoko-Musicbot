const rwm = require('../bot_module/read_write_modul');
//-----------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var prefix = setting.prefix;
var language = setting.language;
//-----------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_deletesong = commands_setting.set_deletesong;
//------------------------------
const lg = require('../language/language - '+language+'.json');
var write_at_private = lg.write_at_private;
//-----------------------------
exports.run = async (bot,message)=>{
                  
    channel = message.channel.id   
    //-----------------------------
    var auth = message.author.username; // ist message author
    var auth_id = message.author.id; // ist message author id
    var msg = message.content.toLowerCase();
    //-----------------------------    
    if (message.channel.name==botchannel){
        //console.log(message.channel.id,"   ", auth_id)
        message.delete();
        return message.author.send("```"+ write_at_private +"```");
    } else{
        rwm.delete_song(auth,auth_id,message,bot,prefix+set_deletesong,set_deletesong.length+2,channel); 
    }    
}

exports.help = {
    name: set_deletesong
}