const discord = require('discord.js')
const fs = require('fs')
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var botchannel = setting.botchannel
var message_size_delete = setting.message_size_delete
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_purge = commands_setting.set_purge
//------------------------------
exports.run = async (bot,message,msz)=>{

    //-----------------------------
    x = fs.readFileSync("./temp/bot_channel_id.json"), err =>{if (err){throw err}}
    var fileback = JSON.parse(x) 
    // read the bot channel id information   
    //-----------------------------
    let bot_MessChannel = bot.channels.find(channel => channel.name === botchannel) // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------   
    if (!fileback.file_is_writen){
        return
    }else{

        console.log(msz)

        bot_MessChannel.bulkDelete(msz)
        setTimeout(function() {
            var embed = new discord.RichEmbed() // message ausgabe
            .addField("delete the last > "+message_size_delete+" < Messages.","-----------------------------",true )
            bot_MessChannel.send(embed)
        }, 1000)
    }
}
//------------------------------
exports.help = {
    name: set_purge
}