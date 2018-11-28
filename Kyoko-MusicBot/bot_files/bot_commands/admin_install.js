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

    //-----------------------------
    let server = bot.guilds.find(guild => guild.name)
    //-----------------------------
    let btroom = bot.channels.find(channel => channel.name === bot_category) 
    let btchan = bot.channels.find(channel => channel.name === botchannel)
    //----------------------------
    // console.log(message.author.id)
    if (message.author.id==admin_id || message.author.id == bot.user.id){
        if(!btchan&&!btroom){
            if(!btroom){server.createChannel(bot_category,'category')}else{btroom.delete(bot_category).then(server.createChannel(bot_category,'category'))}
            if(!btchan){server.createChannel(botchannel,'text')}else{btchan.delete(botchannel).then(server.createChannel(botchannel,'text'))} 
            parentchannel(bot,message)

        }else if(!btchan){
            server.createChannel(botchannel,'text')
            parentchannel(bot,message)       
        }else{
            if(btchan&&btroom){
                btchan.delete(botchannel).then(server.createChannel(botchannel,'text'))
                parentchannel(bot,message)
            }
        }

        if(!btroom){
            server.createChannel(bot_category,'category')
            parentchannel(bot,message)
        }

    }else{
        message.author.send("```"+admin_message+"```")
    }  
}


function parentchannel(bot,message) {
    setTimeout(function () {
        btchan = bot.channels.find(channel => channel.name === botchannel)
        btroom = bot.channels.find(channel => channel.name === bot_category)
        return btchan.setParent(btroom.id)
    }, 1500)
}


exports.help = {
    name: "install"
}
