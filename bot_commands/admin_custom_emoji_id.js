const discord = require('discord.js');
const setting = require('../bot_setting/bot_setting.json');
var admin_id = setting.admin_id;

exports.run = async (bot,message)=>{

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------

    if (message.author.id==admin_id) {
        const emojiList = message.guild.emojis.map((e, x) => (x + ' = ' + e) + ' | ' +e.name).join('\n');
        let embed = new discord.RichEmbed()
        .addField("Custom Emoji Liste :",emojiList )
        .setColor(RandomColor)
        .setTimestamp()
        message.author.send({embed: embed});
    }else{
        message.author.send("```"+"du hast keine admin rechte"+"```");
    };
}

exports.help = {
    name: "emojis"
}