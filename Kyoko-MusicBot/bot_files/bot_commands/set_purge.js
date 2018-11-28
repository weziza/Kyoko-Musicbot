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
var deleted=false
//------------------------------
exports.run = async (bot,message)=>{
    var msz = 0
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
        if(deleted==false){
            deleted=true
            // console.log(msz)            
            setTimeout(function(){
                message.channel.fetchMessages({ limit: 100 }).then(messages => {
                    msz = messages.size   
                    
                    bot_MessChannel.bulkDelete(msz)
                    var embed = new discord.RichEmbed() // message ausgabe
                    .addField("delete the last > " + msz + " < Messages.","-----------------------------",true )
                    bot_MessChannel.send(embed)
                    deleted=false
                }), err =>{if (err){throw err,console.log(err)}}
                //----------             
            }, 2000)
        }
    }
}
//------------------------------
exports.help = {
    name: set_purge
}