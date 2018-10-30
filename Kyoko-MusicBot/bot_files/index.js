const discord = require('discord.js');
const fs = require('fs');
//------------------------------
const bot = new discord.Client();
var botex = bot;
exports.bot = botex;

const guild = new discord.Guild();
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
var set_savesong = commands_setting.set_savesong;
var set_deletesong = commands_setting.set_deletesong;
//------------------------------
var language = setting.language;
//------------------------------
const lg = require('./language/language - '+language+'.json');
var pls_write_in_botchannel = lg.pls_write_in_botchannel;
var purge_size_max_message = lg.purge_size_max_message;
var purge_size_min_message = lg.purge_size_min_message;
//------------------------------
var volu = require('./bot_commands/set_leave');
var VolumeNr = 1;
//------------------------------
var autodelete=false;
//------------------------------
var purge_size = false;
//------------------------------
bot.commands = new discord.Collection();
fs.readdir("./bot_commands/",(err, files)=>{
    if(err)console.error(err)
    let jsfiles = files.filter(f => f.split(".").pop()==="js");
    // read the comman folder and initial the commands in a array
    // parameter files array = filder commands, split der the files and remove the last element
    if(jsfiles.length <= 0){
        console.log("no commands to load");
        return;
    }

    console.log(`loading ${jsfiles.length} commands!`)
    //howe many command files in there
    jsfiles.forEach((f,i)=>{
        let props = require(`./bot_commands/${f}`);
        console.log(`${i+1} : ${f} loaded!`);
        //give the files array a number to listen
        bot.commands.set(props.help.name,props);
    });
});
//------------------------------
bot.on('ready', () => {

    //var channel = bot.channels.get('my-unique-channel-id');
    var channel = bot.channels.find("name", botchannel);
    channel.send("im ready");

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

    //-----------------------------
    let messageArray = message.content.split(/\s+/g); // im channel wurde geschrieben ???
    // let command = messageArray[0];
    let cmd = bot.commands.get(messageArray[0].slice(prefix.length)); 
    // vergleiche den befehl in der messageArray ob dieser in den commands vorhanden ist.
    //-----------------------------
    
    if(message.channel.name==undefined && message.content.startsWith(prefix+set_savesong+" https://www.youtube.com")){
        return cmd.run(bot,message); 
    }else if(message.channel.name==undefined && message.content.startsWith(prefix+set_deletesong)){
        return cmd.run(bot,message); 
    }else{
        //-----------------------------
        var bot_MessChannel = bot.channels.find("name", botchannel); 
        // bot schreibt in einen bestimmten angegebenen channel
        //----------------------------
        if (message_size_delete>100 && purge_size == false){
            purge_size = true;
            return bot_MessChannel.send(carefully(purge_size_max_message));
            // verhindert ein error sollte bulkdelete über 100 liegen.
        }else if(message_size_delete<10 && purge_size == false){
            purge_size = true;
            return bot_MessChannel.send(carefully(purge_size_min_message));
            // sollte delete unter 10 liegen return.
        }else if (purge_size == true){        
            return purge_size = false;
            /*  sollte eines von beiden zutreffen und purge_size wurde schon true gesetzt, 
                dann geh auf false um die abfrage von vorne zu starten. */
        }else{
        //sollte nichts von beiden vor liegen dann geh weiter
     
            //------------------------------
            VolumeNr = volu.VolumeNr;
            //------------------------------
            if(message.content.indexOf(prefix)){
                if(message.channel == bot_MessChannel){return autodelete_function(message,bot_MessChannel)}else{return};                
                // message beginnt mit prefix dann / wenn nicht return und delete all gesendeten messages.
            }else{
                if(message.channel == bot_MessChannel){autodelete_function(message,bot_MessChannel)};
                // sollten zu viele messages im chat stehen wie in der setting angegeben dann mach autodelete.
                //-----------------------------
                var VolNr = message.content.replace(/^[^0-9]+/,' '); // gibt nur zahlen anordnung aus.
                if(message.content.startsWith(prefix+set_volume+" ")){ // music volume controll.
                    VolumeNr = VolNr
                };
                var VolumeNr =  VolumeNr;
                exports.VolumeNr = VolumeNr; //export VolumeNr.
                //-----------------------------
                if (message.channel.name!=botchannel) // ist bot channel ja/nein ??
                { 
                    return message.channel.send(wrap(pls_write_in_botchannel)); // befehle nur im bot channel annehmen.
                }else{                 
                    if(!cmd){ // ist nicht dann                 
                        return message.channel.send(wrap("invalid command")); //wenn der command nach dem prefix falsch geschrieben wurde 
                    }else{ // ist ja dann                   
                        return cmd.run(bot,message);                    
                    };
                };
            };
        };
    };
});
//------------------------------
function autodelete_function(message,bot_MessChannel) {

    if (!autodelete) {
        autodelete = true;
        setTimeout(function () {
            autodelete = false;
            message.channel.fetchMessages({ limit: 100 }).then(messages => {                

                if(messages.size > message_size_delete){
                    message.channel.delete(bot_MessChannel)
                    setTimeout(function () {   
                        var server = message.guild;
                        server.createChannel(botchannel, "text")
                    }, 500);
                    return; 
                }
                if(messages.size == message_size_delete) {
                    let purge = bot.commands.get(set_purge);
                    return purge.run(bot, message.channel);
                };
            }); 
        }, 500);
    };
}
//------------------------------
function wrap(text) {
    return '```http\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
};
//------------------------------
function carefully(text) {
    return '```css\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
};
//------------------------------
bot.on("error",function(error){
    console.log(error.message);
});
//------------------------------
bot.on("debug",function(debug){
    if(debugBot==true){
    console.log(debug);}
});
//------------------------------
bot.login(token); // bot token
//------------------------------
