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
var bot_author_Image = BotImages.bot_author_Image;
var Thumbimage = require('../bot_images/Thumbimage.json');
var bot_leave = Thumbimage.bot_leave;
var music_not_playing = Thumbimage.music_not_playing;
var no_voice_connect = Thumbimage.no_voice_connect;
var play_music = Thumbimage.play_music;
var pause = Thumbimage.pause;
var resume = Thumbimage.resume;
var play_forward = Thumbimage.play_forward;
var queue_clean = Thumbimage.queue_clean;
var skip_fail = Thumbimage.skip_fail;
var no_music_image = Thumbimage.no_music_image;
var connect_channel = Thumbimage.connect_channel;
var no_playlist = Thumbimage.no_playlist;
var playlist = Thumbimage.playlist;
//---------------------------------------
var bot_playing=false;
var bot_pause=false;
var bot_resume=false;
var bot_in_channel=false;
//------------------------------
var Warteschlange_Array = []; 
var SongTitel_Array = [];
var SongTitel_Buffer = [];
//------------------------------
var bot = index.bot; //import var bot aus script index.js
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

    exports.getsbi = function (url_mess, info_url){

        if (MaxQueue==MinQueue){ // ist das max der song aufnahme erreicht dann....
            message.delete();// lösche die gepostete url messages  
            return bot_MessChannel.send(wrap(`Die Warteschlange ist voll`)); // message rückgabe
        }else{            

            Warteschlange_Array.push(url_mess); //push url message in die Warteschlange array
            SongTitel_Buffer.push(info_url); //info url message in die SongTitel array
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => (( x +  1  ) + ': ' + SongTitel_Buffer)).join('\n'); //füge nummerierung beim auslesen hinzu           
            //---------------------------------------
            MinQueue++; // Song counder ++
            //---------------------------------------
            
            if(!bot_playing) memberchannel.join().then(function(connection){ //sollte der bot spielen dann connect zum voicechannel
                bot_playing=true; //sag dem bot das er jetz spielt
                //--------------------------------------- 
                // connect message
                if(!bot_in_channel){ //ist der bot nicht im Voicechannel dann mach die connect message
                    bmess.ambedMessage("connect to Voice Channel :",'```HTTP'+'\n' + message.member.voiceChannel.name + '\n```',bot_MessChannel,RandomColor,BotName,connect_channel);
                }                               
                //---------------------------------------                                           
                play(connection,message,bot_MessChannel); //connect to voicechannel        
                return bmess.ambedMessage("hinzugefügt :", '```HTTP'+'\n' + SongTitel_Array + '```', bot_MessChannel, RandomColor, BotName, play_music);  
                //ist der bot nicht im voicechannel send SongTitel_Array message
            });
            
            else if(bot_playing){ //ist der bot im voicechannel send SongTitel_Array message
                return bmess.ambedMessage("hinzugefügt :", '```HTTP'+'\n' + SongTitel_Array + '```', bot_MessChannel, RandomColor, BotName, play_music);
                //ist der bot im voicechannel send SongTitel_Array message
            }; 
        };
    };
};
//---------------------------------------
exports.play_song = function (memberchannel,message,bot_MessChannel,url){

    var time = 0;

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    if (MinQueue<0){MinQueue=0  // der song counter kann nicht unter 0 fallen
        return};

    if (MaxQueue==MinQueue){ // ist das max der song aufnahme erreicht dann....
        message.delete();// lösche die gepostete url messages  
        return bot_MessChannel.send(wrap(`Die Warteschlange ist voll`)); // message rückgabe
    }else{            

        if(!bot_playing) memberchannel.join().then(function(connection){
            bot_playing=true;                         
            //--------------------------------------- 
            // connect message
            bmess.ambedMessage("connect to Voice Channel :",'```HTTP'+'\n' + message.member.voiceChannel.name + '\n```',bot_MessChannel,RandomColor,BotName,connect_channel);
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
            SongTitel_Buffer.push(time.toFixed(2) + " min" +" - "+ videoInfo.title); 
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => (( x +  1  ) + ': ' + SongTitel_Buffer)).join('\n');            
            //---------------------------------------
            MinQueue++; // Song counder ++
            //---------------------------------------
            message.delete();// lösche die gepostete url messages 
            return bmess.ambedMessage("hinzugefügt :", '```HTTP'+'\n' + SongTitel_Array + '```', bot_MessChannel, RandomColor, BotName, play_music);

        });
    };    
};
//---------------------------------------
exports.search_song = function(memberchannel,message,sucheVideo,bot_MessChannel,prefix) {

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
exports.queue =  function(message,bot_MessChannel){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    if (SongTitel_Array.length<1) {
        return bmess.ambedMessage("-",'```HTTP'+'\n' + "Kein Song: in der Warteschlange" + '```', bot_MessChannel, RandomColor, BotName, no_playlist);
    }
    else {
        return bmess.ambedMessage("in der Warteschlange :", '```HTTP'+'\n' + SongTitel_Array + '```', bot_MessChannel, RandomColor, BotName, playlist);
    }
};
//---------------------------------------
exports.clean_queue = function(memberchannel,message,bot_MessChannel){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if(SongTitel_Array.length>0){
        message.guild.voiceConnection.player.dispatcher.destroyed = true; // destroy das laufende lied
        // nach dem nächsten play xxx geht der bot wieder in funktion play und bekommt automatisch destroy = false
        // die funktion destroyt alles connect info, momentaner stream usw... alle infos sind weg.  
        message.guild.voiceConnection.player.dispatcher.resume(); // resume stream funktion sonst bleibt der bot auf play stream
        Warteschlange_Array = [], SongTitel_Array = [],SongTitel_Buffer = []; //leere alle arrays
        bot_in_channel=true; //bot befindet sich noch im voicechannel
        bot_playing=false; // sag dem bot er spielt keine music mehr
        bot_defaultVolume_option=true; //ist die warteschlane geleert geht der bot auf default volume 
        MinQueue=0; // Queue auf null setzen, warteschlange ist leer                              
        bmess.ambedMessage("SongListe wurde gelehrt :",'```HTTP'+'\n' + "du kannst neue Songs in die Liste laden." + '```', bot_MessChannel,RandomColor,BotName,queue_clean);
    }else bmess.ambedMessage("SongListe ist leer :",'```HTTP'+'\n' + "es gibt nichts zu cleanen." + '```', bot_MessChannel,RandomColor,BotName,no_playlist);
};
//---------------------------------------
exports.leave = function(bot_MessChannel,message){

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------

    if(!bot_playing&&!bot_in_channel){
        bmess.ambedMessage(" Bot ist in keinem :",'```HTTP'+'\n' + "Voicechannel." + '```', bot_MessChannel,RandomColor,BotName,no_voice_connect);  
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect(); // disconect voice channel
    }else{
        bmess.ambedMessage(" Man sieht sich wieder :",'```HTTP'+'\n' + "bestimmt." + '```', bot_MessChannel,RandomColor,BotName,bot_leave);
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect(); // disconect voice channel
    }
};
//---------------------------------------
exports.skip = function(message,bot_MessChannel,voiceConnection){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------    
    if(!voiceConnection){
        console.log(bot_playing);
        return bmess.ambedMessage(" Bot ist in keinem :",'```HTTP'+'\n' + "Voicechannel." + '```', bot_MessChannel,RandomColor,BotName,no_voice_connect);
    }else if(!bot_playing){
        return bmess.ambedMessage(" Warteschlange :",'```HTTP'+'\n' + "ist leer." + '```', bot_MessChannel,RandomColor,BotName,skip_fail); 
    }else if(dispatcher){
        dispatcher.end(); // geh zur funktion end
    }; 
};
//---------------------------------------
exports.pause = function(message,prefix,voiceConnection,bot_MessChannel){
    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //---------------------------------------
    // Get the voice connection.
    if (voiceConnection === null) return bmess.ambedMessage("-",'```HTTP'+'\n' + 'Es spielt keine Musik' + '```', bot_MessChannel,RandomColor,BotName,music_not_playing);
    
    // Pause.    
    const dispatcher = voiceConnection.player.dispatcher;
    if (!dispatcher.play&&!bot_pause) {
        dispatcher.pause(bmess.ambedMessage("-",'```HTTP'+'\n' + 'Stream Pause.' + '```', bot_MessChannel,RandomColor,BotName,pause));
        bot_pause=true;
        bot_resume=true;
    }else{return bmess.ambedMessage("-",'```HTTP'+'\n' + 'player ist in der Pause' + '```', bot_MessChannel,RandomColor,BotName,music_not_playing);}
}; 
//---------------------------------------
exports.resume = function(message,prefix,voiceConnection,bot_MessChannel){
    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //---------------------------------------   
    // Get the voice connection.
    if (voiceConnection === null) return bmess.ambedMessage("-",'```HTTP'+'\n' + 'Es spielt keine Musik' + '```', bot_MessChannel,RandomColor,BotName,music_not_playing);

    // Resume.    
    const dispatcher = voiceConnection.player.dispatcher;
    if (dispatcher.pause&&bot_resume) {
        dispatcher.resume(bmess.ambedMessage("-",'```HTTP'+'\n' + 'Resume Stream.' + '```', bot_MessChannel,RandomColor,BotName,resume));
        bot_pause=false;
        bot_resume=false;
    }else{return;};
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
function play(connection,message,bot_MessChannel){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    dispatcher = connection.playStream(ytdl(Warteschlange_Array[0], { filter: "audioonly" }));
    //stream die erste stelle der array.. also [0] 
    //-----------------------------
    Warteschlange_Array.shift(); //shift gleich die erste stelle in der array...  
    // bei einem lead ist der bot eigentlich schon bei disconnect nach dem abspielen des ersten liedes
    //-----------------------------
    if (vlNr>defaultVolume){
        dispatcher.setVolume(vlNr); // vlNr volume solange kein - disconnect gemacht wurde
    }else{
        dispatcher.setVolume(defaultVolume); // defaultVolume volume wenn play stream resetet wird - disconnect
    };        

    dispatcher.on("end",function(){
        if(Warteschlange_Array[0]){ //solange noch etwas in der Warteschlange_Array ist shift diese          
            MinQueue-- // -- queue aus der warteschlange
            play(connection,message,bot_MessChannel),SongTitel_Buffer.shift();  // replay and shift SongTitel_Buffer um eine stelle       
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => ((x + 1) + ': ' + SongTitel_Buffer)).join('\n'); //füge nummerierung zur SongTitel_Array hinzu                    
            //--------         
            return bmess.ambedMessage('Warteschlange :','```HTTP'+'\n' + SongTitel_Array + '```',bot_MessChannel,RandomColor,BotName,play_forward); // message ausgabe - Warteschlange SongTitel_Array
        }else{connection.disconnect() //ist Warteschlange_Array leer disconnect und setze alles zurück.
            bot_playing=false; //reset bot_playing
            bot_in_channel=false; //reset bot_in_channel
            //--------            
            MinQueue=0; // setze queue auf null
            Warteschlange_Array = [],SongTitel_Array = [],SongTitel_Buffer = []; // setze alle arrays auf null fals noch etwas darin sein sollze         
            //--------
            vlNr=defaultVolume; // default volume  
            //--------           
            return bot_MessChannel.send({files: [no_music_image]});  // send leave image                   
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