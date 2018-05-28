const discord = require('discord.js');
const bmess = require('./bot_module/bot_message_modul');
const rwm = require('./bot_module/read_write_modul');
const sgm = require('./bot_module/music_play_modul');
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
var MaxQueue = setting.MaxQueue;
//------------------------------
var set_ping = setting.set_ping;
var set_mega = setting.set_mega;
var set_uhr = setting.set_uhr;
var set_hilfe = setting.set_hilfe;
var set_clean = setting.set_clean;
var set_queue = setting.set_queue;
var set_skip = setting.set_skip;
var set_volume = setting.set_volume;
var set_purge = setting.set_purge;
var set_pause = setting.set_pause;
var set_resume = setting.set_resume;
var set_leave = setting.set_leave;
var set_randomsong = setting.set_randomsong;
var set_songliste = setting.set_songliste;
var set_savesong = setting.set_savesong;
var set_deletesong = setting.set_deletesong;
var set_searchsong = setting.set_searchsong;
var set_playsong = setting.set_playsong;
//------------------------------
var autodelete=false;
//------------------------------
var botname = bot;
exports.bot = botname;
//------------------------------
var VolumeNr = 1
//------------------------------
bot.on('ready', () => {
    bot.user.setActivity("Auskunft mit -->  "+ prefix + set_hilfe); 
    console.log(`[Start] ${new Date()}`," ----> ready");   
});
//------------------------------
bot.on('messageReactionAdd', (reaction, user, message) => {

    //console.log(reaction.emoji.id);
    /*if(reaction.emoji.id==null){

    }else{
        bot.channels.find("name", botchannel).send(reaction.emoji.name+" = "+reaction.emoji.id);
        return;
    }*/

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
 
    if(message.content.startsWith("emoji_id"+"<:")){
        console.log(message.content);
        var messagenumber=message.content.replace(/^[^0-9]+/,' '); //suche nach zahlen und replace alles davor mit nichts
        return bot.channels.find("name", botchannel).send(messagenumber.slice(messagenumber,messagenumber.length-1)); 
        //return bot.channels.find("name", botchannel).send(messagenumber);       
    };

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
        const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
        //console.log(voiceConnection)
        //-----------------------------
        var memberchannel = message.member.voiceChannel;     
        //-----------------------------
        var auth = message.author.username; // ist message author
        var auth_id = message.author.id; // ist message author id
        var bot_MessChannel = bot.channels.find("name", botchannel); // bot schreibt in einen bestimmten angegebenen channel
        var msg = message.content.toLowerCase();
        var url = message.content.split(' ')[1]; // gibt die url aus split prefix aus
        var case_args = message.content.substring("").split(" "); // für switch funktion erkenne prefix/text angabe 
        var VolNr = message.content.replace(/^[^0-9]+/,' '); //gibt nur zahlen anordnung aus
        var sucheVideo = message.content.split(' ').slice(1).join(" ");
        //------------------------------

        if(message.content.startsWith(prefix+set_volume+" ")){
            VolumeNr = VolNr
        };

        //------------------------------
        var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
        var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
        //-----------------------------

        if(!message.content.includes("")) return;
        switch(case_args[0].toLowerCase()){
        case prefix+set_ping: //funktioniert
            var embed = new discord.RichEmbed()
            .addField(BotName+` Ping ist `+` = `+`${(bot.ping)/10}`+` ms`,'Dein Ping'+" "+auth+" "+'ist'+" = "+`${(message.createdTimestamp-new Date().getTime())/100}`+' ms', true)
            .setTimestamp()
            .setFooter(BotName,"https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png")  
            .setColor(RandomColor)
            bot_MessChannel.send(embed);
            break;
        case prefix+set_mega: //funktioniert
            var embed = new discord.RichEmbed()
            .setTitle(`Ich bin der super duba Mega heftig `+BotName)
            .setImage("https://cdn.discordapp.com/attachments/386866941849239555/430671085235732490/DanceBot.gif")
            .setTimestamp()        
            .setFooter(BotName,"https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png")  
            .setColor(RandomColor)
            bot_MessChannel.send(embed);
            break;
        case prefix+set_uhr: //funktioniert
            var embed = new discord.RichEmbed()
            .addField(`Uhrzeit - Datum - Zeitzone`,`${new Date()}`, true)
            .setTimestamp()
            .setFooter(BotName,"https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png")  
            .setColor(RandomColor)
            bot_MessChannel.send(embed);
            break;    
        case prefix+set_hilfe: // funktioniert  
            bmess.InfoScreen(set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_mega,set_ping,bot_MessChannel,prefix,RandomColor,MaxQueue,BotName); //info ausgabe
            break;
        case prefix+set_searchsong: // funktioniert
            if (!memberchannel) {
                return bot_MessChannel.send(wrap('Du musst erst ein Voice channel betreten'));
            }else{
                sgm.search_song(memberchannel,message,sucheVideo,bot_MessChannel,prefix);
                exports.get_url = function(url){
                    sgm.play_song(memberchannel,message,bot_MessChannel,url); 
                } 
            }         
            break;
        case prefix+set_playsong: // funktioniert
            if(!memberchannel){return bot_MessChannel.send(wrap('Du musst erst ein Voice channel betreten'));}
            else if(!message.content.slice(prefix.length+set_playsong.length+1).startsWith("https://www.youtube.com")){
                var getNumber = message.content.slice(set_playsong.length+2);
                if(getNumber.search(/^[^a-z]+/)){
                    return;
                }else{
                    rwm.get_song_at_list(auth_id,message,bot,prefix+set_playsong,set_playsong.length+2,prefix,botchannel,memberchannel,set_playsong);
                    sgm.get_song(memberchannel,message,bot_MessChannel);
                    return;
                };               
            }else{                
                var https = message.content.slice(prefix.length+set_playsong.length+1);                   
                sgm.play_song(memberchannel,message,bot_MessChannel,https);
                return;   
            };
            break;
        case prefix+set_clean: // funktioniert      
            sgm.clean_queue(memberchannel,message,bot_MessChannel)
            break; 
        case prefix+set_queue: //funktioniert
            sgm.queue(message,bot_MessChannel);
            break;
        case prefix+set_skip: // funktioniert 
            //const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
            sgm.skip(message,bot_MessChannel,voiceConnection);
            break;
        case prefix+set_pause: // geh zu funktion pause / galube das spinnt noch etwas
            sgm.pause(message,prefix,voiceConnection,bot_MessChannel); 
            break;
        case prefix+set_resume: // geh zu funktion resume  / galube das spinnt noch etwas
            sgm.resume(message,prefix,voiceConnection,bot_MessChannel);
            break;    
        case prefix+set_leave: //funktioniert
            sgm.leave(bot_MessChannel,message);
            break;
        case prefix+set_volume: //funktioniert
            //const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); // initial voiceConnection
            sgm.volume(message,VolumeNr,voiceConnection);  // funktion Volume 
            break;    
        case prefix+set_purge: //funktioniert
            autodelete=false;
            message.channel.bulkDelete(100).then(() => { // lösche 100 chat zeilen
            var embed = new discord.RichEmbed() // message ausgabe
            .addField(100+"Messages Gelöscht.","-----------------------------",true );
            bot_MessChannel.send(embed).then(m => m.delete(3000));
            });
            break; 
        case prefix+set_randomsong: //funktioniert        
            return rwm.Random_song(auth_id,message,bot,prefix+set_randomsong,prefix,botchannel,memberchannel,bot_MessChannel);    
            break; 
        case prefix+set_songliste: //funktioniert  
            return rwm.songliste(auth,auth_id,message,bot,botchannel);
            break;
        case prefix+set_savesong: //funktionier               
            rwm.save_song(auth,auth_id,message,bot,prefix+set_savesong,set_savesong.length+2,botchannel,msg);
            break;
        case prefix+set_deletesong: //funktionier               
            rwm.delete_song(auth,auth_id,message,bot,prefix+set_deletesong,set_deletesong.length+2,botchannel);
            break;
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