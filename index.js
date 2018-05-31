const discord = require('discord.js');
const fs = require('fs');
//------------------------------
const bot = new discord.Client();
//------------------------------
const playerEmoji = require('./bot_images/player_emoji');
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
var BotName = setting.BotName;
var MDelete = setting.Delete_Message;
//------------------------------
var set_hilfe = setting.set_hilfe;
var set_clean = setting.set_clean;
var set_skip = setting.set_skip;
var set_volume = setting.set_volume;
var set_pause = setting.set_pause;
var set_resume = setting.set_resume;
//------------------------------
var autode = require('./bot_commands/set_purge');
var autodelete=false;
//------------------------------
var botname = bot;
exports.bot = botname;
//------------------------------
var volu = require('./bot_commands/set_leave');
var VolumeNr = 1;
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
    bot.user.setActivity("Auskunft mit -->  "+ prefix + set_hilfe); 
    console.log(`[Start] ${new Date()}`," ----> ready");
    console.log(bot.commands);  
});
//------------------------------
bot.on('messageReactionAdd', (reaction, user, message) => {

    if(reaction.emoji.id === pauseEmoji) {
        if(user.username==BotName){
            return;
        }else{
            //console.log(user.id,user.username);
            reaction.remove(user.id)
            bot.channels.find("name", botchannel).send(prefix+set_pause);
        }
    }
    if(reaction.emoji.id === playEmoji) {
        if(user.username==BotName){
            return;
        }else{
            //console.log(user.id,user.username);
            reaction.remove(user.id)
            bot.channels.find("name", botchannel).send(prefix+set_resume);
        }
    }
    if(reaction.emoji.id === cleanEmoji) {
        if(user.username==BotName){
            return;
        }else{
            //console.log(user.id,user.username);
            reaction.remove(user.id)
            bot.channels.find("name", botchannel).send(prefix+set_clean);
        }
    }
    if(reaction.emoji.id === skipEmoji) {
       if(user.username==BotName){
            return;
       }else{
            //console.log(user.id,user.username);
            reaction.remove(user.id)
            bot.channels.find("name", botchannel).send(prefix+set_skip);
        }
    }
    if(reaction.emoji.id === kickEmoji) {
        if(user.username==BotName){
            return;
        }else{
            //console.log(user.id,user.username);
            reaction.remove(user.id)
            bot.channels.find("name", botchannel).send(prefix+set_leave);
        }
    }
    if(reaction.emoji.id === volumeupEmoji) {
        if(user.username==BotName){
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
        if(user.username==BotName){
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
                
        VolumeNr = volu.VolumeNr;
        autodelete = autode.autodelete;

        if(message.content.indexOf(prefix)){ //message beginnt mit prefix dann / wenn nicht return
            return;
        }else{        
            if(!autodelete){
                autodelete=true;
                message.channel.fetchMessages({limit: MDelete}).then(messages => {
                    if(messages.size==MDelete){
                        bot.channels.find("name", botchannel).send("+purge"); //Auto delete 100 messages
                    }
                });
            }; 
            //-----------------------------
            var VolNr = message.content.replace(/^[^0-9]+/,' '); //gibt nur zahlen anordnung aus
            //------------------------------
            if(message.content.startsWith(prefix+set_volume+" ")){ //music volume controll
                VolumeNr = VolNr
            };
            var VolumeNr =  VolumeNr;
            exports.VolumeNr = VolumeNr;            
            //------------------------------
            let messageArray = message.content.split(/\s+/g);
            let command = messageArray[0];
            let cmd = bot.commands.get(command.slice(prefix.length))
            if(cmd) cmd.run(bot,message);
            //------------------------------  
        };
    }; 
});
//------------------------------
bot.login(token); // bot token
//------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}
//------------------------------
