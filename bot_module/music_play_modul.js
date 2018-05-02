const bmess = require('./bot_message_modul');
const index = require("../index");
//---------------------------------------
const ytdl = require("ytdl-core");
const youtubedl = require('youtube-dl');
const fetchVideoInfo = require("youtube-info");
const request = require("request");
//---------------------------------------
const setting = require('../bot_setting/bot_setting.json');
const defaultVolume = setting.defaultVolume;
const botchannel = setting.botchannel;
const yt_api_key = setting.yt_api_key;
const set_skip = setting.set_skip;
const BotName = setting.BotName;
var MaxQueue = setting.MaxQueue;
var MinQueue = 0;
//---------------------------------------
var BotImages = require('../bot_images/botAuthor.json');
var botAuthorImage = BotImages.botAuthorImage;
var Thumbimage = require('../bot_images/Thumbimage.json');
var QueueSong = Thumbimage.QueueSong;
var NoQueue = Thumbimage.NoQueue;
var ConnectToVoiceCh = Thumbimage.ConnectToVoiceCh;
var skip = Thumbimage.skip;
var NoQueueListe = Thumbimage.NoQueueListe;
var QueueListe = Thumbimage.QueueListe;
var NoVoiceCh = Thumbimage.NoVoiceCh;
var Leave = Thumbimage.Leave;
var QueueClean = Thumbimage.QueueClean;
var QueueLeer = Thumbimage.QueueLeer;
var Pause = Thumbimage.Pause;
var Resume = Thumbimage.Resume;
//---------------------------------------
bot_playing=false;
//------------------------------
var Warteschlange_Array = []; 
var SongTitel_Array = [];
var SongTitel_Buffer = [];
//------------------------------
var bot = index.bot;
//------------------------------
var vlNr = defaultVolume;
//------------------------------
var URLArray=[ // zufall url ergenzung wenn die suche fehlschlägt
    "FlmToFkw9W0",
    "LLB39g0ix1A",
    "3_-a9nVZYjk",
    "Mgfe5tIwOj0"]
//------------------------------
exports.get_song = function (memberchannel, message,bot_MessChannel,voiceConnection) {

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    if (MinQueue<0){MinQueue=0  // der song counter kann nicht unter 0 fallen
        return};

    exports.getsbi = function (urlmess, info_url){ 

        if (MaxQueue==MinQueue){ // ist das max der song aufnahme erreicht dann....
            message.delete();// lösche die gepostete url messages  
            bot_MessChannel.send(wrap(`Die Warteschlange ist voll`)); // message rückgabe
            return; // if abfrage beenden
        }else{            
            if(!bot_playing) memberchannel.join().then(function(connection){
                bot_playing=true;
                //--------------------------------------- 
                // connect message
                bmess.ambedMessage("connect to Voice Channel :",message.member.voiceChannel.name,bot_MessChannel,RandomColor,BotName,botAuthorImage,ConnectToVoiceCh);
                //---------------------------------------                                           
                play(connection,message,bot_MessChannel);  
            }); 
            Warteschlange_Array.push(urlmess);
            SongTitel_Buffer.push(info_url);
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => ((x + 1) + ': ' + SongTitel_Buffer)).join('\n');            
            //---------------------------------------
            MinQueue++; // Song counder ++
            //---------------------------------------
            message.delete();// lösche die gepostete url messages  
            return bmess.ambedMessage("hinzugefügt :", SongTitel_Array, bot_MessChannel, RandomColor, BotName, botAuthorImage, QueueSong);
        };
    };
};
//---------------------------------------
exports.play_song = function (memberchannel, message,bot_MessChannel,url){

    var time = 0;

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    if (MinQueue<0){MinQueue=0  // der song counter kann nicht unter 0 fallen
        return};

    if (MaxQueue==MinQueue){ // ist das max der song aufnahme erreicht dann....
        message.delete();// lösche die gepostete url messages  
        bot_MessChannel.send(wrap(`Die Warteschlange ist voll`)); // message rückgabe
        return; // if abfrage beenden
    }else{            

        if(!bot_playing) memberchannel.join().then(function(connection){
            bot_playing=true;                             
            //--------------------------------------- 
            // connect message
            bmess.ambedMessage("connect to Voice Channel :",message.member.voiceChannel.name,bot_MessChannel,RandomColor,BotName,botAuthorImage,ConnectToVoiceCh);
            //---------------------------------------            
            play(connection,message,bot_MessChannel);  
        });

        Warteschlange_Array.push(url);
        ytdl.getInfo(url = String(url), (error, videoInfo) => { // url ausgabe information
            if (error) {
                return message.channel.send(wrap("Error unvollständige url")); // error unvollständige url
            }
            //---------------------------------------
            time = videoInfo.length_seconds / 60; //viedeo Time
            SongTitel_Buffer.push(videoInfo.title +" : "+ time.toFixed(2) + " min");
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => ((x + 1) + ': ' + SongTitel_Buffer)).join('\n');            
            //---------------------------------------
            MinQueue++; // Song counder ++
            //---------------------------------------
            message.delete();// lösche die gepostete url messages 
            return bmess.ambedMessage("hinzugefügt :", SongTitel_Array, bot_MessChannel, RandomColor, BotName, botAuthorImage, QueueSong);
        });
    };    
};
//---------------------------------------
exports.queue_function =  function(message,bot_MessChannel){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    if (SongTitel_Array.length<1) {
        return bmess.ambedMessage("Kein Song", "in der Warteschlange", bot_MessChannel, RandomColor, BotName, botAuthorImage, NoQueueListe);
    }
    else {
        return bmess.ambedMessage("- in der Warteschlange  :", SongTitel_Array, bot_MessChannel, RandomColor, BotName, botAuthorImage, QueueListe);
    }
};
//---------------------------------------
exports.bot_leave = function(bot_MessChannel,message){

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------

    if(!bot_playing){
        bot_playing=false; // is bot joint channel
        bmess.ambedMessage("- Bot ist in keinem :","Voice Channel.", bot_MessChannel,RandomColor,BotName,botAuthorImage,NoVoiceCh);  
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect(); // disconect voice channel
    }else{
        bmess.ambedMessage("- Man sieht sich wieder :","bestimmt.", bot_MessChannel,RandomColor,BotName,botAuthorImage,Leave);
        bot_playing=false; // is bot joint channel
        MinQueue = 0; // Queue auf null setzen
        Warteschlange_Array=[];  // Warteschlange_Array leeren   
        SongTitel_Array=[]; // SongTitel_Array leeren leeren
        SongTitel_Buffer = []; // SongTitel_Buffer leeren leeren
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect(); // disconect voice channel
    }
};
//---------------------------------------
exports.clean_queue = function(message,bot_MessChannel){

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if(SongTitel_Array.length>0){
        bot_defaultVolume_option=true; 
        MinQueue=0;  // Queue auf null setzen                                 
        Warteschlange_Array=[];  // Warteschlange_Array leeren   
        SongTitel_Array=[]; // SongTitel_Array leeren leeren
        SongTitel_Buffer = []; // SongTitel_Buffer leeren leeren
        message.guild.voiceConnection.player.dispatcher.destroyed = true // destroy das laufende lied 
        message.guild.voiceConnection.player.dispatcher.resume() // resume stream funktion sonst bleibt der bot bei destroy 
        bot_playing=false; // sag dem script musik play = false.
        bmess.ambedMessage("- SongListe wurde gelehrt :","du kannst neue Songs in die Liste laden.", bot_MessChannel,RandomColor,BotName,botAuthorImage,QueueClean);
    }else bmess.ambedMessage("- SongListe ist leer","es gibt nichts zu cleanen.", bot_MessChannel,RandomColor,BotName,botAuthorImage,QueueLeer);
};
//---------------------------------------
exports.song_skip = function(message,bot_MessChannel,voiceConnection){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------    
    if(!voiceConnection){
        bmess.ambedMessage('es gibt nicht zum skipen.'," - ", bot_MessChannel,RandomColor,BotName,botAuthorImage,NoVoiceCh);
    }else if(!bot_playing){        
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();  // ist interner_Titel > 0 also leer  dann disconnect aus channel
        return; // sonst RichEmbed error da er in else geht und InfoText1 oder InfoText2 keine info bekommt -- RichEmbed field values may not be empty.
    }else if(dispatcher){
        dispatcher.end()}; // geh zur funktion end
};
//---------------------------------------
exports.pause = function(message,prefix,voiceConnection,bot_MessChannel){
    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //---------------------------------------
    // Get the voice connection.
    if (voiceConnection === null) return message.channel.send(wrap('Es spielt keine Musik.')); // ist voiceConnection = 0 return message

    // Pause.
    bmess.ambedMessage('Playback pause.'," - ", bot_MessChannel,RandomColor,BotName,botAuthorImage,Pause);
    const dispatcher = voiceConnection.player.dispatcher;
    if (!dispatcher.play) dispatcher.pause(); // dispatcher pause
}; 
//---------------------------------------
exports.resume = function(message,prefix,voiceConnection,bot_MessChannel){
    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //---------------------------------------   
    // Get the voice connection.
    if (voiceConnection === null) return message.channel.send(wrap('Es spielt keine Musik.')); // ist voiceConnection = 0 return message

    // Resume.
    bmess.ambedMessage('Playback resumed.'," - ", bot_MessChannel,RandomColor,BotName,botAuthorImage,Resume);
    const dispatcher = voiceConnection.player.dispatcher;
    if (dispatcher.pause) dispatcher.resume(); // dispatcher resume
};
//---------------------------------------
exports.volume = function(message,VolumeNr,voiceConnection){    
    if (voiceConnection === null) return message.channel.send(wrap('Es spielt keine Musik.')); // ist voiceConnection = 0 return message
    const dispatcher = voiceConnection.player.dispatcher; // initial dispatcher
    if (VolumeNr < 11){ // ist max Volume kleiner als
        if (VolumeNr > 0 ){ // ist max Volume größer als              
            dispatcher.setVolume(VolumeNr/20);
            vlNr = VolumeNr/20;      
        }else{return message.channel.send(wrap('Volume out of range!'))};  // message wenn wert darüber oder darunter ist      
    }else{return message.channel.send(wrap('Volume out of range!'))}; // message wenn wert darüber oder darunter ist 
};
//---------------------------------------
exports.searchsong = function(memberchannel,message,sucheVideo,bot_MessChannel,prefix) {

    var url = 0;
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    /**
    * Youtube Url Suche
    * @param {Object} getID - gibt die Youtube Id Aus
    * @param {Object} search_video - sucht nach der URL in Youtube
    * @param {Object} URLArray zufall url ergenzung wenn die suche fehlschlägt 
    */
    function getID(str, cb) {
        search_video(str, function(id) {
            cb(id);
        });
    };
    
    function search_video(query, callback) {
        request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {
            var json = JSON.parse(body);        
            if (!json.items[0])callback(URLArray[Math.floor(Math.random()* URLArray.length)]);  
            else {callback(json.items[0].id.videoId);}     
        });
    };

    getID(sucheVideo, function (id) {
        fetchVideoInfo(id, function (err, videoInfo) {
            index.get_url(videoInfo.url);            
        });
    });
};
//---------------------------------------
function play(connection,message,bot_MessChannel){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    dispatcher = connection.playStream(ytdl(Warteschlange_Array[0], { filter: "audioonly" }));
    Warteschlange_Array.shift();

    if (vlNr>defaultVolume){
        dispatcher.setVolume(vlNr); // vlNr volume on play
    }else{
        dispatcher.setVolume(defaultVolume); // defaultVolume volume on play
    };        

    dispatcher.on("end",function(){
        if(Warteschlange_Array[0]){           
            MinQueue-- // -- queue aus der warteschlange
            play(connection,message,bot_MessChannel),SongTitel_Buffer.shift();            
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => ((x + 1) + ': ' + SongTitel_Buffer)).join('\n');
            //console.log(!bot_MessChannel);                        
            //---------------------------------------         
            return bmess.ambedMessage('Warteschlange :',SongTitel_Array,bot_MessChannel,RandomColor,BotName,botAuthorImage,skip); // message ausgabe - Warteschlange SongTitel_Array
        }else{connection.disconnect()            
            bot_playing=false;
            //--------            
            MinQueue=0; // setze queue auf null
            Warteschlange_Array = [],SongTitel_Array = [],SongTitel_Buffer = [];
            //--------
            vlNr=defaultVolume;
            //--------  
            //console.log(bot_MessChannel);          
            return bmess.ambedMessage(" - Warteschlange"," ist leer.", bot_MessChannel,RandomColor,BotName,botAuthorImage,NoQueue);                
        }  
    }).on('error', (error) => {
        console.log(error, " connection");
    }); 
};
//---------------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
};
//---------------------------------------