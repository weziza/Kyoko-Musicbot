const discord = require('discord.js');
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var message_size_delete = setting.message_size_delete;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_purge = commands_setting.set_purge;
//------------------------------
exports.run = async (bot,message)=>{
    //-----------------------------
    let bot_MessChannel = bot.channels.find(channel => channel.name === botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------   
    if (bot_MessChannel == undefined){
        return;
    }else{
        bot_MessChannel.bulkDelete(message_size_delete);
        setTimeout(function() {
            var embed = new discord.RichEmbed() // message ausgabe
            .addField("delete the last > "+message_size_delete+" < Messages.","-----------------------------",true );
            bot_MessChannel.send(embed);

        }, message_size_delete*10);
    };
};
//------------------------------
exports.help = {
    name: set_purge
}