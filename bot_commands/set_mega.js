const discord = require('discord.js');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var BotName = setting.BotName;
var botchannel = setting.botchannel;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_mega = commands_setting.set_mega;
//------------------------------

exports.run = async (bot,message)=>{

    //------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel

    var embed = new discord.RichEmbed()
    .setTitle(`Ich bin der super duba Mega heftig `+BotName)
    .setImage("https://cdn.discordapp.com/attachments/386866941849239555/430671085235732490/DanceBot.gif")
    .setTimestamp()        
    .setFooter(BotName,"https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png")  
    .setColor(RandomColor)
    bot_MessChannel.send(embed);
}

exports.help = {
    name: set_mega
}