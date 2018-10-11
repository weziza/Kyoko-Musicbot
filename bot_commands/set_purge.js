const discord = require('discord.js');
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
var message_size_delete = setting.message_size_delete;
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_purge = commands_setting.set_purge;
//------------------------------
const description = require('../bot_setting/description.json');
var purge_size_message = description.purge_size_message;
//------------------------------
exports.run = async (bot,message)=>{
    //-----------------------------
    let bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
    //-----------------------------   
    if (bot_MessChannel == undefined){
        return;
    }else{

        if (message_size_delete<10){
            return bot_MessChannel.send(wrap(purge_size_message));
        }else{        
            bot_MessChannel.bulkDelete(message_size_delete);
            setTimeout(function() {
                var embed = new discord.RichEmbed() // message ausgabe
                .addField("delete the last > "+message_size_delete+" < Messages.","-----------------------------",true );
                bot_MessChannel.send(embed);

            }, message_size_delete*10);
        } 
    } 
}
 //------------------------------
 function wrap(text) {
    return '```css\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
};
//------------------------------
exports.help = {
    name: set_purge
}