const discord = require('discord.js');
const ytdl = require("ytdl-core")
const youtubedl = require('youtube-dl');
const fetchVideoInfo = require("youtube-info");
const request = require("request");
const SBM = require('./bot_module/BotMessage');
const rasi = require('./bot_module/read_write_modul');
//------------------------------
const express = require('express');
const bodyParses = require('body-parser');
const server = express();
//------------------------------
const bot = new discord.Client();
//------------------------------
var BotImages = require('./bot_images/botAuthor.json');
var botAuthorImage = BotImages.botAuthorImage;
var Thumbimage = require('./bot_images/Thumbimage.json');
var Pause = Thumbimage.Pause;
var Resume = Thumbimage.Resume;
var Leave = Thumbimage.Leave;
var NoVoiceCh = Thumbimage.NoVoiceCh;
var QueueSong = Thumbimage.QueueSong;
var QueueClean = Thumbimage.QueueClean;
var QueueLeer = Thumbimage.QueueLeer;
var NoQueue = Thumbimage.NoQueue;
var ConnectToVoiceCh = Thumbimage.ConnectToVoiceCh;
var skip = Thumbimage.skip;
var NoQueueListe = Thumbimage.NoQueueListe;
var QueueListe = Thumbimage.QueueListe;
//------------------------------
var setImage = require('./bot_images/InfoEmbedImage');
var setThumbnail = require('./bot_images/InfoEmbedThumbnail');
//------------------------------
const setting = require('./bot_setting/bot_setting.json');
const token = setting.token;
const ChatChannel = setting.botchannel;
const allgeChannel = setting.allgemeinChat;
const prefix = setting.prefix;
const defaultVolume = setting.defaultVolume;
const yt_api_key = setting.yt_api_key;
var MaxQueue = setting.MaxQueue;
var BotName = setting.BotName;
var MDelete = setting.Delete_Message;
var MinQueue =  0;
var serverId = setting.serverId
//------------------------------
var set_ping = setting.set_ping
var set_mega = setting.set_mega
var set_witz = setting.set_witz
var set_uhr = setting.set_uhr
var set_hilfe = setting.set_hilfe
var set_clean = setting.set_clean
var set_queue = setting.set_queue
var set_skip = setting.set_skip
var set_volume = setting.set_volume
var set_purge = setting.set_purge
var set_pause = setting.set_pause
var set_resume = setting.set_resume
var set_leave = setting.set_leave
var set_skip = setting.set_skip
var set_getsong = setting.set_getsong
var set_randomsong = setting.set_randomsong
var set_songliste = setting.set_songliste
var set_savesong = setting.set_savesong
var set_deletesong = setting.set_deletesong
var set_searchsong = setting.set_searchsong
var set_playsong = setting.set_playsong
//------------------------------
const eventMarkdown="```md";
const eventhtml="```html";
const eventpython="```python"
const eventcss="```css";
const event= "#[ Event-Bot Nachricht ]"
const teilN= ">--- für teilnahme click Emoji --->";
const eventclosed= "```";
//------------------------------
var bot_sound_option=true;
var bot_joint=false;
var autodelete=false;
//------------------------------
var Warteschlange_Array = {}; 
var TrackTitel_Array = [];
//------------------------------
var URLArray=[ // zufall url ergenzung wenn die suche fehlschlägt
    "FlmToFkw9W0",
    "LLB39g0ix1A",
    "3_-a9nVZYjk",
    "Mgfe5tIwOj0"]
//------------------------------

// html function noch in arbeit momentan geht nur purge botchannel und senden einer nachricht in botchannel

server.use(bodyParses.urlencoded({extended: true}));


server.listen(serverId,function(){console.log('listening to port '+serverId)});

server.get('/', function (req, res) {
    res.sendFile(__dirname+'/index.html');
});

server.post('/', function (req, res) {
    res.sendFile(__dirname+'/index.html');
    console.log("/");
});  


server.post('/purge', function(req,res){
    console.log("purge");

    bot.channels.find("name", ChatChannel).send("+purge");
    res.sendFile(__dirname+'/index.html');
}); 

server.post('/sendMessage', function(req,res){
    
    var mess = JSON.stringify(req.body).slice(6);    
    var senMess = mess.slice(0,mess.length-2);

    console.log(mess.slice(0,mess.length-2));
    bot.channels.find("name", ChatChannel).send(senMess);
    res.sendFile(__dirname+'/index.html');
});

//------------------------------
/**
* Youtube Url Suche
* @param {Object} getID - gibt die Youtube Id Aus
* @param {Object} search_video - sucht nach der URL in Youtube
* @param {Object} default URL NEUROFUNK DRUM&BASS MIX - JANUARY 2018 
*/
function getID(str, cb) {
    search_video(str, function(id) {
        cb(id);
    });
}
function search_video(query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {
        var json = JSON.parse(body);        
        if (!json.items[0])callback(URLArray[Math.floor(Math.random()* URLArray.length)]);  
        else {callback(json.items[0].id.videoId);}     
    });
}
//------------------------------
bot.on('ready', () => {
    bot_sound_option=true
    //bot.channels.find("name", ChatChannel).send("+play https://www.youtube.com/watch?time_continue=7&v=FlmToFkw9W0");
    console.log(`[Start] ${new Date()}`," ----> ready");    
});
//------------------------------


bot.on("message",function(message){   
    

    if(message.content.indexOf(prefix)){ //message begint mit prefix dann / wenn nicht return
        //console.log("no prefix")
        return;
    }else{
        setTimeout(() => { //kleiner time out wegen zu schnellen spam
          
            if(!autodelete){
                autodelete=true;
                message.channel.fetchMessages({limit: MDelete}).then(messages => {
                    //console.log(`${messages.size} messages found`);
                    if(messages.size==MDelete){
                        bot.channels.find("name", ChatChannel).send("+purge"); //Auto delete 100 messages
                    }
                });
            }; 

            var memberchannel = message.member.voiceChannel;
            var voicechannelid = message.member.voiceChannelID;        
            //-----------------------------
            var auth = message.author.username; // ist message author
            var auth_id = message.author.id; // ist message author id
            var MessChannel = bot.channels.find("name", ChatChannel); // bot schreibt in einen bestimmten angegebenen channel
            var msg = message.content.toLowerCase();
            var url = message.content.split(' ')[1]; // gibt die url aus split prefix aus
            var case_args = message.content.substring("").split(" "); // für switch funktion erkenne prefix/text angabe 
            var onlyNum = message.content.substring("").replace(/^[^0-9]+/, ''); //gibt nur zahlen anordnung aus
            const argVideo = message.content.split(' ').slice(1).join(" ");
            //-----------------------------
            var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
            var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
            //-----------------------------
            if (MinQueue<0){MinQueue=0  // der song counter kann nicht unter 0 fallen
                return};
            //-----------------------------
            if (!Warteschlange_Array[message.guild.id]) Warteschlange_Array[message.guild.id]={  // initial interne_Warteschlange & interner_Titel
                interne_Warteschlange: [], 
                interner_Titel: []
            };
            //-----------------------------
            if(!message.content.includes("")) return;
            switch(case_args[0].toLowerCase()){
            case prefix+set_ping: //funktioniert
                SusiiPing = `${bot.ping.toFixed(0)}`;
                var embed = new discord.RichEmbed()
                .addField(BotName+`Ping`+" = "+bot.ping+` ms`,'Dein Ping'+" "+auth+" "+'ist'+" = "+`${Date.now() - message.createdTimestamp}`+' ms', true)
                .setTimestamp()
                .setFooter(BotName,"https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fsnapchat-download.net%2Fwp-content%2Fuploads%2F2015%2F10%2Fsnapchat-blue-double-arrow-icon-mean.png&f=1")  
                .setColor(RandomColor)
                MessChannel.send(embed);
                //console.log(Date.now())
                break;
            case prefix+set_mega: //funktioniert
                var embed = new discord.RichEmbed()
                .setTitle(`Ich bin der super duba Mega heftig `+BotName)
                .setImage("https://cdn.discordapp.com/attachments/386866941849239555/430671085235732490/DanceBot.gif")
                .setTimestamp()        
                .setFooter(BotName,"https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fsnapchat-download.net%2Fwp-content%2Fuploads%2F2015%2F10%2Fsnapchat-blue-double-arrow-icon-mean.png&f=1")  
                .setColor(RandomColor)
                MessChannel.send(embed);
                break;
            case prefix+set_witz: //funktioniert
                return MessChannel.send(wrap('schau in den spiegel')+auth);
                break;  
            case prefix+set_uhr: //funktioniert
                var embed = new discord.RichEmbed()
                .addField(`Uhrzeit - Datum - Zeitzone`,`${new Date()}`, true)
                .setTimestamp()
                .setFooter(BotName,"https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fsnapchat-download.net%2Fwp-content%2Fuploads%2F2015%2F10%2Fsnapchat-blue-double-arrow-icon-mean.png&f=1")  
                .setColor(RandomColor)
                MessChannel.send(embed);
                break;    
            case prefix+set_hilfe: // funktioniert  
                SBM.InfoScreen(set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_getsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_witz,set_mega,set_ping,MessChannel,setImage,setThumbnail,prefix,RandomColor,MaxQueue); //info ausgabe
                break;
            case prefix+set_searchsong: // Video Youtube suche
                if (!memberchannel){
                    bot.channels.find("name", ChatChannel).send(wrap('Du musst erst ein Voice channel betreten'));
                }else getID(argVideo, function (id){
                        fetchVideoInfo(id, function (err, videoInfo){  
                            memberchannel.join();           
                            return bot.channels.find("name", ChatChannel).send(prefix + "play" + " " + videoInfo.embedURL);
                        });
                    });  
                break;
            case prefix+set_playsong: // Music play 

                    if (MaxQueue==MinQueue){ // ist das max der song aufnahme erreicht dann....
                        message.delete();// lösche die gepostete url messages  
                        message.channel.send(wrap(`Die Warteschlange ist voll`)); // message rückgabe
                        return; // if abfrage beenden
                    }
                    if(!url){return MessChannel.send(wrap(`Füge zuerst einen Songs zur Warteschlange hinzu mit `+prefix+`play https://`));}
                    else if(!msg.includes("https://")){ MessChannel.send(wrap(`bitte Url einfügen mit `+prefix+`play https://`));}        
                    else if(!memberchannel){return MessChannel.send(wrap('Du musst erst ein Voice channel betreten'));}
                    else if(!message.guild.voiceConnection) memberchannel.join().then(function(connection){                       
                        bot_joint=true;
                        //--------------------------------------- 
                        // connect message
                        SBM.ambedMessage("connect to Voice Channel :",message.member.voiceChannel,MessChannel,RandomColor,BotName,botAuthorImage,ConnectToVoiceCh);
                        //--------------------------------------- 
                        play(connection,message);
                    });
                    else if(!bot_joint && memberchannel) memberchannel.join().then(function(connection){                    
                        bot_joint=true;                             
                        //--------------------------------------- 
                        // connect message
                        SBM.ambedMessage("connect to Voice Channel :",message.member.voiceChannel,MessChannel,RandomColor,BotName,botAuthorImage,ConnectToVoiceCh);
                        //---------------------------------------
                        play(connection,message);     
                    });
                    //---------------------------------------
                    message.delete(); // delete the url messages       
                    var BoTServer = Warteschlange_Array[message.guild.id]; // initíal BoTServer
                    //-----------------------------         
                    BoTServer.interne_Warteschlange.push(url) // push die url in die interne_Warteschlange
                    ytdl.getInfo(url = String(url), (error, videoInfo) => { // url ausgabe information
                        if (error) {
                            return message.channel.send(wrap("Error unvollständige url")); // error unvollständige url
                        }
                        else {                     
                            TrackTitel_Array = videoInfo.title; //gibt der TrackTitel_Array, video info dazu
                            var time = videoInfo.length_seconds / 60; //viedeo Time               
                            BoTServer.interner_Titel.push(TrackTitel_Array + " : " + time.toFixed(2) + " minuten"); // push server + TrackTitel_Array in den BoTServer
                            BoTServer = BoTServer.interner_Titel.map((TrackTitel_Array, index) => ((index + 1) + ': ' + TrackTitel_Array)).join('\n'); // fügt dem BoTServer noch nummern hinzu 1: split, 2: split, 3: split, usw          
                            //---------------------------------------
                            SBM.ambedMessage("hinzugefügt :",BoTServer, MessChannel,RandomColor,BotName,botAuthorImage,QueueSong);
                            //--------------------------------------- 
                            MinQueue++ // Song counder ++    
                        };
                    });     
                break;
            case prefix+set_clean: // cleanqueue      
                //---------------------------------------
                var BoTServer = Warteschlange_Array[message.guild.id]; // initial bot server 
                //console.log(BoTServer.interner_Titel+"  "+BoTServer.interne_Warteschlange)    
                if(BoTServer.interner_Titel.length>0){
                    bot_joint=false; // is bot join channel
                    MinQueue=0;  // Queue auf null setzen                                 
                    BoTServer.interne_Warteschlange=[];  // warteschlange leeren   
                    BoTServer.interner_Titel=[]; // Song titel leeren leeren             
                    if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect(); // disconect voice channel
                    SBM.ambedMessage("- SongListe wurde gelehrt :","der letzte Song läuft noch zu ende.", MessChannel,RandomColor,BotName,botAuthorImage,QueueClean);
                }else SBM.ambedMessage("- SongListe ist leer","es gibt nichts zu cleanen.", MessChannel,RandomColor,BotName,botAuthorImage,QueueLeer);;            
                break; 
            case prefix+set_queue: //funktioniert gut
                var BoTServer = Warteschlange_Array[message.guild.id]; // initial bot server
                if (BoTServer.interner_Titel<1){
                    SBM.ambedMessage("Kein Song","in der Warteschlange", MessChannel,RandomColor,BotName,botAuthorImage,NoQueueListe);   
                }else{
                    TrackTitel_Array=BoTServer.interner_Titel; // TrackTitel_Array ist gleich der interner_Titel Array
                    SBM.ambedMessage("- in der Warteschlange  :",TrackTitel_Array, MessChannel,RandomColor,BotName,botAuthorImage,QueueListe);
                }
                break;
            case prefix+set_skip: // funktioniert
                var BoTServer = Warteschlange_Array[message.guild.id]; // initial bot server
                const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); 
                //---------------------------------------        
                if (BoTServer.interne_Warteschlange.length<1){
                    if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();  // ist interner_Titel > 0 also leer  dann disconnect aus channel
                    return; // sonst RichEmbed error da er in else geht und InfoText1 oder InfoText2 keine info bekommt -- RichEmbed field values may not be empty.
                }else if(BoTServer.dispatcher){ BoTServer.dispatcher.end()}; // geh zur funktion end
                break;
            case prefix+set_pause: // geh zu funktion pause / galube das spinnt noch etwas
                return pause(message, prefix); 
            case prefix+set_resume: // geh zu funktion resume  / galube das spinnt noch etwas
                return resume(message, prefix);    
            case prefix+set_leave: //funktioniert
                //---------------------------------------
                var BoTServer = Warteschlange_Array[message.guild.id]; // initial bot server    
                
                if(!bot_joint){
                    bot_joint=false; // is bot joint channel
                    SBM.ambedMessage("- Bot ist in keinem :","Voice Channel.", MessChannel,RandomColor,BotName,botAuthorImage,NoVoiceCh);  
                }else{
                    SBM.ambedMessage("- Man sieht sich wieder :","bestimmt.", MessChannel,RandomColor,BotName,botAuthorImage,Leave);
                    bot_joint=false; // is bot joint channel
                    MinQueue = 0; // Queue auf null setzen
                    BoTServer.interne_Warteschlange=[];  // warteschlange leeren   
                    BoTServer.interner_Titel=[]; // Song titel leeren leeren   
                    if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect(); // disconect voice channel
                }
                break;
            case prefix+set_volume: //funktioniert
                return volume(message, onlyNum);  // funktion Volume     
            case prefix+set_purge: //funktioniert
                autodelete=false;
                message.channel.bulkDelete(100).then(() => { // lösche 100 chat zeilen
                var embed = new discord.RichEmbed() // message ausgabe
                .addField(100+"Messages Gelöscht.","-----------------------------",true )
                MessChannel.send(embed).then(m => m.delete(3000));
                return SBM.InfoScreen(set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_getsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_witz,set_mega,set_ping,MessChannel,setImage,setThumbnail,prefix,RandomColor,MaxQueue); //info ausgabe 
                });
                break;
                //----------------------------
            case prefix+set_getsong: //funktioniert
                return rasi.getsong(auth_id,message,bot,prefix+set_getsong,set_getsong.length+2,prefix,ChatChannel,memberchannel,set_playsong);    
                break; 
            case prefix+set_randomsong: //funktioniert        
                return rasi.getRandom(auth_id,message,bot,prefix+set_randomsong,prefix,ChatChannel,memberchannel,set_playsong);    
                break; 
            case prefix+set_songliste: //funktioniert  
                return rasi.songliste(auth,auth_id,message,bot,ChatChannel);
                break;
            case prefix+set_savesong: //funktionier               
                rasi.savesong(auth,auth_id,message,bot,prefix+set_savesong,set_savesong.length+2,ChatChannel,msg);
                break;
            case prefix+set_deletesong: //funktionier               
                rasi.deletesong(auth,auth_id,message,bot,prefix+set_deletesong,set_deletesong.length+2,ChatChannel);
                break;    
            }
        }, 100)    
    }    
});
bot.login(token); // bot token
//---------------------------------------
function volume(message, onlyNum){
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); // initial voiceConnection
    if (voiceConnection === null) return message.channel.send(wrap('Es spielt kein Musik.')); // ist voiceConnection = 0 return message
    const dispatcher = voiceConnection.player.dispatcher; // initial dispatcher
    if (onlyNum < 11){ // ist max Volume kleiner als
        if (onlyNum > 0 ){ // ist max Volume größer als              
            dispatcher.setVolume(onlyNum/20);        
        }else{return message.channel.send(wrap('Volume out of range!'))};  // message wenn wert darüber oder darunter ist      
    }else{return message.channel.send(wrap('Volume out of range!'))}; // message wenn wert darüber oder darunter ist 
}
//---------------------------------------
function pause(message, prefix){
    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //---------------------------------------
    // Get the voice connection.
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); // initial voiceConnection
    if (voiceConnection === null) return message.channel.send(wrap('Es spielt keine Musik.')); // ist voiceConnection = 0 return message

    // Pause.
    var MessChannel = bot.channels.find("name", ChatChannel);
    SBM.ambedMessage('Playback pause.'," - ", MessChannel,RandomColor,BotName,botAuthorImage,Pause);
    const dispatcher = voiceConnection.player.dispatcher;
    if (!dispatcher.play) dispatcher.pause(); // dispatcher pause
} 
function resume(message, prefix){
    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //---------------------------------------   
    // Get the voice connection.
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id); // initial voiceConnection
    if (voiceConnection === null) return message.channel.send(wrap('Es spielt keine Musik.')); // ist voiceConnection = 0 return message

    // Resume.
    var MessChannel = bot.channels.find("name", ChatChannel);
    SBM.ambedMessage('Playback resumed.'," - ", MessChannel,RandomColor,BotName,botAuthorImage,Resume);
    const dispatcher = voiceConnection.player.dispatcher;
    if (dispatcher.pause) dispatcher.resume(); // dispatcher resume
}
//---------------------------------------
function play(connection, message){
    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //---------------------------------------
    var BoTServer = Warteschlange_Array[message.guild.id];
    var MessChannel = bot.channels.find("name", ChatChannel);    
    //console.log(BoTServer.interner_Titel.length+"  | interner_Titel");
    if(BoTServer.interner_Titel.length<1){ // wird der song speicher gleich auf null gesetzt == TypeError: Cannot read property 'encode' of null / StreamDispatcher.js:133 error
        BoTServer.dispatcher = connection.playStream(ytdl(BoTServer.interne_Warteschlange[0], { filter: "audioonly" }));   
        BoTServer.interne_Warteschlange.shift(); 
    }else{ // ist der song speicher über 1, mach diese wariante sonst geht der speicher von 1 direkt auf 0, wegen BoTServer.interne_Warteschlange.shift()
        BoTServer.dispatcher = connection.playStream(ytdl(BoTServer.interne_Warteschlange[0], { filter: "audioonly" }));
    } 

    if (bot_sound_option=true){
        bot_sound_option=false;
        BoTServer.dispatcher.setVolume(defaultVolume); // defaultVolume volume on play
    }    
    BoTServer.dispatcher.on("end",function(){ 
        if (BoTServer.interner_Titel.length>0){  

            if(BoTServer.interne_Warteschlange[0]){
                play(connection,message);                
                MinQueue-- // -- queue aus der warteschlange
                BoTServer.interne_Warteschlange.shift(); //-- delete 1 aus warteschlange
                BoTServer.interner_Titel.shift(); //-- delete 1 aus warteschlange
                //---------------------------------------
                TrackTitel_Array=BoTServer.interner_Titel;
                SBM.ambedMessage('Warteschlange :',TrackTitel_Array, MessChannel,RandomColor,BotName,botAuthorImage,skip); // message ausgabe - Warteschlange TrackTitel_Array
            }else{connection.disconnect()
                bot_joint=false;
                bot_sound_option=true;
                MinQueue=0; // setze queue auf null
                BoTServer.interne_Warteschlange=[]; // setze die warteschlange zurück 
                BoTServer.interner_Titel=[]; // setze die song titel zurück
                SBM.ambedMessage(" - Warteschlange"," ist leer.", MessChannel,RandomColor,BotName,botAuthorImage,NoQueue);     
                console.log("song end 1");}            
                return;
        }else{connection.disconnect()
            bot_joint=false;
            bot_sound_option=true;
            MinQueue=0; // setze queue auf null
            BoTServer.interne_Warteschlange=[]; // setze die warteschlange zurück 
            BoTServer.interner_Titel=[]; // setze die song titel zurück
            SBM.ambedMessage(" - Warteschlange"," ist leer.", MessChannel,RandomColor,BotName,botAuthorImage,NoQueue);     
            console.log("song end 2");
        }     
    }).on('error', (error) => {
        // Skip to the next song.
        console.log(error, " connection");
    });         
}
//---------------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}
//---------------------------------------