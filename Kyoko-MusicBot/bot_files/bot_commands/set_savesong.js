const spm = require('../bot_module/songprocess_modul')
const fs = require('fs')
//-----------------------------
const setting = require('../bot_setting/bot_setting.json')
var prefix = setting.prefix
var botchannel = setting.botchannel
var language = setting.language
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_savesong = commands_setting.set_savesong
//------------------------------
const lg = require('../language/language - '+language+'.json')
var write_at_private = lg.write_at_private
//-----------------------------
exports.run = async (bot,message)=>{
    //-----------------------------
    channel = message.channel.id   
    //-----------------------------
    var auth = message.author.username // ist message author
    var auth_id = message.author.id // ist message author id  
    //-----------------------------
    x = fs.readFileSync("./temp/bot_channel_id.json"), err =>{if (err){throw err}}
    var fileback = JSON.parse(x)   
    //hole dir die informationen aus der bot_channel_id.json
    //-----------------------------    
    if (fileback.botchannel_id != message.channel.id ){
        // console.log(message.channel.id,"   ", " auth_id ==  ",auth_id)
        message.delete()
        return message.author.send(carefully(write_at_private))
    } else{
        message.delete()
        spm.save_song(auth,auth_id,message,bot,prefix+set_savesong,set_savesong.length+2,channel) 
    }     
}
//------------------------------
function carefully(text) {
    return '```css\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------
exports.help = {
    name: set_savesong
}