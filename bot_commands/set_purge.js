const discord = require('discord.js');
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var set_purge = setting.set_purge;

exports.run = async (bot,message)=>{
    //-----------------------------
    var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------    
    var autodelete = autodelete=false;
    exports.autodelete = autodelete;

    message.channel.bulkDelete(100).then(() => { // lösche 100 chat zeilen
        var embed = new discord.RichEmbed() // message ausgabe
        .addField("löscht bis zu > "+100+" < Messages.","-----------------------------",true );
        bot_MessChannel.send(embed).then(m => m.delete(3000));
    });
}

exports.help = {
    name: set_purge
}