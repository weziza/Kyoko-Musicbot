const discord = require('discord.js');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var bot_name = setting.bot_name;
var botchannel = setting.botchannel;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_ping = commands_setting.set_ping;
//------------------------------
exports.run = async (bot,message)=>{

    //------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------

    var auth = message.author.username; // ist message author
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    const m = await message.channel.send("Kyoko send Ping?");
    var embed = new discord.RichEmbed()
    .addField(`Latency is`,`${m.createdTimestamp - message.createdTimestamp}ms.`, true)
    .addField(`API Latency is`,`${Math.round(bot.ping)}ms`, true)
    .setTimestamp()
    .setFooter(bot_name,"https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png")  
    .setColor(RandomColor)
    bot_MessChannel.send(embed);
}

exports.help = {
    name: set_ping
}