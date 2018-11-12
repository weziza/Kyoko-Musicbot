
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var bot_category = setting.bot_category
var botchannel = setting.botchannel
var admin_id = setting.admin_id
var language = setting.language
//------------------------------
const lg = require('../language/language - '+language+'.json')
var admin_message = lg.admin_message
//-----------------------------

exports.run = async (bot,message)=>{

    let server = bot.guilds.find(guild => guild.name)

    //-----------------------------
    let bot_MessChannel = bot.channels.find(channel => channel.name === botchannel) 
    // bot schreibt in einen bestimmten angegebenen channel
    //----------------------------

    if (message.author.id==admin_id){ 

        if(!bot_category){
            if(botchannel){
                btc = bot.channels.find("name",botchannel)
                if(!btc){server.createChannel(botchannel,'text')}else{btc.delete(botchannel).then(server.createChannel(botchannel,'text'))} 
            }else{ return bot_MessChannel.send("no bot channel config") }
        }else{
            room = bot.channels.find("name",bot_category)
            if(!room){server.createChannel(bot_category,'category')}else{room.delete(bot_category).then(server.createChannel(bot_category,'category'))}
            
            btc = bot.channels.find("name",botchannel)
            if(!btc){server.createChannel(botchannel,'text')}else{btc.delete(botchannel).then(server.createChannel(botchannel,'text'))} 
        }  

        setTimeout(function(){ 
            if(bot.channels.find("name",botchannel)&&bot.channels.find("name",bot_category)){
                room = bot.channels.find("name",bot_category)
                btc = bot.channels.find("name",botchannel)
                btc.setParent(room.id)
            }
        }, 1000)
    }else{
        message.author.send("```"+admin_message+"```")
    }  
}

exports.help = {
    name: "install"
}