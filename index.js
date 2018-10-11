const discord = require('discord.js');
const fs = require('fs');
//------------------------------
const bot = new discord.Client();
var botex = bot;
exports.bot = botex;
//------------------------------
const playerEmoji = require('./bot_setting/emoji_setting');
var playEmoji = playerEmoji.playEmoji;
var pauseEmoji = playerEmoji.pauseEmoji;
var skipEmoji = playerEmoji.skipEmoji;
var kickEmoji = playerEmoji.kickEmoji;
var volumeupEmoji = playerEmoji.volumeupEmoji;
var volumedownEmoji = playerEmoji.volumedownEmoji;
var cleanEmoji = playerEmoji.cleanEmoji;
//------------------------------
const setting = require('./bot_setting/bot_setting.json');
var token = setting.token;
var botchannel = setting.botchannel;
var prefix = setting.prefix;
var bot_name = setting.bot_name;
var message_size_delete = setting.message_size_delete;
var debugBot = setting.debugBot;
//------------------------------
const commands_setting = require('./bot_setting/commands_setting.json');
var set_hilfe = commands_setting.set_hilfe;
var set_clean = commands_setting.set_clean;
var set_skip = commands_setting.set_skip;
var set_volume = commands_setting.set_volume;
var set_pause = commands_setting.set_pause;
var set_resume = commands_setting.set_resume;
var set_leave = commands_setting.set_leave;
var set_purge = commands_setting.set_purge;
//------------------------------
const description = require('./bot_setting/description.json');
var pls_write_in_botchannel = description.pls_write_in_botchannel;
//------------------------------
var volu = require('./bot_commands/set_leave');
var VolumeNr = 1;
//------------------------------
var autodelete=false;
//------------------------------
bot.commands = new discord.Collection();
fs.readdir("./bot_commands/",(err, files)=>{
    if(err)console.error(err)
    let jsfiles = files.filter(f => f.split(".").pop()==="js");
    if(jsfiles.length <= 0){
        console.log("no commands to load");
        return;
    }

    console.log(`loading ${jsfiles.length} commands!`)
    jsfiles.forEach((f,i)=>{
        let props = require(`./bot_commands/${f}`);
        console.log(`${i+1} : ${f} loaded!`);
        bot.commands.set(props.help.name,props);
    });
});
//------------------------------
bot.on('ready', () => {

    bot.user.setActivity("-->  "+ prefix + set_hilfe +"  <--");
    console.log(""+
        "\n" +
        `[Start] ${new Date()}`," ----> ready" + 
        "\n" +
        ""+ 
        "\n" + 
        "                               Written by H5Pro2       " + 
        "\n" + 
        "                           https://github.com/H5Pro2"+
        "\n" +       
        "<<-------------------------------------------------------------------------->> break line"
    );

}); 
//------------------------------
bot.on('messageReactionAdd', (reaction, user, message) => {  
    
    //console.log(user.id,user.username,bot_name);

    if(reaction.emoji.id == pauseEmoji) {
        if(user.username==bot_name){
            return;
        }else{
            reaction.remove(user.id)
            //bot.channels.find("name", botchannel).send(prefix+set_pause);
            var pause = bot.commands.get(set_pause)
            pause.run(bot,reaction.message.channel);
        }
    }
    if(reaction.emoji.id === playEmoji) {
        if(user.username==bot_name){
            return;
        }else{
            reaction.remove(user.id)
            //bot.channels.find("name", botchannel).send(prefix+set_resume);
            var resume = bot.commands.get(set_resume)
            resume.run(bot,reaction.message.channel);
        }
    }
    if(reaction.emoji.id === cleanEmoji) {
        if(user.username==bot_name){
            return;
        }else{
            reaction.remove(user.id)
            //bot.channels.find("name", botchannel).send(prefix+set_clean);
            var clean = bot.commands.get(set_clean)
            clean.run(bot,reaction.message.channel);
        }
    }
    if(reaction.emoji.id === skipEmoji) {
        if(user.username==bot_name){
                return;
        }else{
            reaction.remove(user.id)
            //bot.channels.find("name", botchannel).send(prefix+set_skip);
            var skip = bot.commands.get(set_skip)
            skip.run(bot,reaction.message.channel);
        }
    }
    if(reaction.emoji.id === kickEmoji) {
        if(user.username==bot_name){
            return;
        }else{
            reaction.remove(user.id)
            //bot.channels.find("name", botchannel).send(prefix+set_leave);
            var kick = bot.commands.get(set_leave)
            kick.run(bot,reaction.message.channel);
        }
    }
    if(reaction.emoji.id === volumeupEmoji) {
        if(user.username==bot_name){
            return;
        }else{
            if(VolumeNr>9){
                VolumeNr=10;
                return reaction.remove(user.id);
            }else{
                VolumeNr++
                reaction.remove(user.id);
                return bot.channels.find("name", botchannel).send(prefix+set_volume+" "+VolumeNr);
            }
        }
    }    
    if(reaction.emoji.id === volumedownEmoji) {
        if(user.username==bot_name){
            return;
        }else{
            if(VolumeNr<2){
                VolumeNr=1;
                return reaction.remove(user.id);
            }else{
                VolumeNr--
                reaction.remove(user.id)
                return bot.channels.find("name", botchannel).send(prefix+set_volume+" "+VolumeNr);
            }
        }
    }       
});
//------------------------------ 
bot.on("message",function(message){

    if(message.channel.name==undefined){
        /*verhindert ein error wenn man den bot privat anschreibt zb +play[Nr]
        (ist message.channel.name undefined) dann return.*/
        return;
    }else{     
        //------------------------------
        VolumeNr = volu.VolumeNr;
        //------------------------------
        if(message.content.indexOf(prefix)){ //message beginnt mit prefix dann / wenn nicht return
            return autodelete_function(message);
        }else{ 
            //-----------------------------
            autodelete_function(message);
            //-----------------------------
            var VolNr = message.content.replace(/^[^0-9]+/,' '); //gibt nur zahlen anordnung aus
            if(message.content.startsWith(prefix+set_volume+" ")){ //music volume controll
                VolumeNr = VolNr
            };
            var VolumeNr =  VolumeNr;
            exports.VolumeNr = VolumeNr; //export VolumeNr
            //-----------------------------
            var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
            //-----------------------------
            let messageArray = message.content.split(/\s+/g); //im channel wurde geschrieben ???
            //let command = messageArray[0];
            let cmd = bot.commands.get(messageArray[0].slice(prefix.length)); 
            //vergleiche den befehl in der messageArray ob dieser in den commands vorhanden ist
            //----------------------------- 
            if (message.channel.name!=botchannel) //ist bot channel ja/nein ??
            { 
                return message.channel.send(wrap(pls_write_in_botchannel)); //befehle nur im bot channel annehmen
            }else{                 
                if(!cmd){ //ist nicht dann                 
                    return message.channel.send(wrap("invalid command")); //wenn der command nach dem prefix falsch geschrieben wurde 
                }else{ // ist ja dann                   
                    return cmd.run(bot,message);                    
                };
            };
        };
    };
});
//------------------------------
function autodelete_function(message) {
    //console.log(autodelete)
    if (!autodelete) {
        autodelete = true;
        setTimeout(function () {
            autodelete = false;
            message.channel.fetchMessages({ limit: message_size_delete }).then(messages => {
                if (messages.size == message_size_delete) {
                    console.log("fetchMessages - index");
                    //return bot.channels.find("name", botchannel).send(prefix+set_purge); //Auto delete 100 messages
                    var purge = bot.commands.get(set_purge);
                    return purge.run(bot, message.channel);
                }
            });
        }, 500);
    };
}
//------------------------------
function wrap(text) {
    return '```http\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
};
//------------------------------
bot.on('guildMemberSpeaking',function(GuildMember,speaking){
    const channel = bot.channels.find("name", botchannel);
    if(!speaking){
        return;
    }else{
        //channel.send(GuildMember.user.username+"\n"+"spricht die anderen müssen ruig sein");
    }
});
//------------------------------
bot.on('voiceStateUpdate',function(old_Member,new_Member){

    var Member_Name = new_Member.user.username   
    if (Member_Name==bot_name){
  
    };    
});
//------------------------------
bot.on("error",function(error){
    console.log(error.message);
});

bot.on("debug",function(debug){
    if(debugBot==true){
    console.log(debug);}
});
//------------------------------
bot.login(token); // bot token
//------------------------------
