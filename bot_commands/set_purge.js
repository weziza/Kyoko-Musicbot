const discord = require('discord.js');
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var Delete_Message = setting.Delete_Message;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_purge = commands_setting.set_purge;
//------------------------------
exports.run = async (bot,message)=>{
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------    
    message.channel.bulkDelete(Delete_Message).then(() => { // lösche 100 chat zeilen
        var embed = new discord.RichEmbed() // message ausgabe
        .addField("delete the last > "+Delete_Message+" < Messages.","-----------------------------",true );
        bot_MessChannel.send(embed).then(m => m.delete(3000));
    });
}

exports.help = {
    name: set_purge
}