const discord = require('discord.js');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var set_ping = setting.set_ping;
var BotName = setting.BotName;
var botchannel = setting.botchannel;
//------------------------------

exports.run = async (bot,message)=>{

    //------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------

    var auth = message.author.username; // ist message author
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel

    var embed = new discord.RichEmbed()
    .addField(BotName+` Ping ist `+` = `+`${(bot.ping)}`+` ms`,'Dein Ping'+" "+auth+" "+'ist'+" = "+`${new Date().getTime() - message.createdTimestamp}`+' ms', true)
    .setTimestamp()
    .setFooter(BotName,"https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png")  
    .setColor(RandomColor)
    bot_MessChannel.send(embed);
}

exports.help = {
    name: set_ping
}