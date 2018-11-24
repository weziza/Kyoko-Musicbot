const spm = require('../bot_module/songprocess_modul');
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
    x = fs.readFileSync("./temp/bot_channel_id.json"), err =>{if (err){throw err}}
    var fileback = JSON.parse(x)   
    //hole dir die informationen aus 
    //-----------------------------    
    if (fileback.botchannel_id != message.channel.id ){
        // console.log(message.channel.id,"   ", " auth_id ==  ",auth_id)
        message.delete();
        return message.author.send("```"+ write_at_private +"```");
    } else{
        spm.delete_song(auth,auth_id,message,bot,prefix+set_deletesong,set_deletesong.length+2,channel); 
    }    
}

exports.help = {
    name: set_deletesong
}