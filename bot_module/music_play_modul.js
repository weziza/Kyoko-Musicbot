const bmess = require('./bot_message_modul');
//---------------------------------------
const ytdl = require("ytdl-core");
const fetchVideoInfo = require("youtube-info");
const request = require("request");
//---------------------------------------
const setting = require('../bot_setting/bot_setting.json');
var defaultVolume = setting.defaultVolume;
var yt_api_key = setting.yt_api_key;
var bot_name = setting.bot_name;
var max_queue = setting.max_queue;
var MinQueue = 0;
//---------------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_queue = commands_setting.set_queue;
//---------------------------------------
const Thumbimage = require('../bot_images/Thumbimage.json');
var bot_leave_image  = Thumbimage.bot_leave;
var music_not_playing_image = Thumbimage.music_not_playing;
var no_voice_connect_image = Thumbimage.no_voice_connect;
var play_music_image = Thumbimage.play_music;
var pause_image = Thumbimage.pause;
var resume_image = Thumbimage.resume;
var play_forward_image = Thumbimage.play_forward;
var queue_clean_image = Thumbimage.queue_clean;
var skip_fail_image = Thumbimage.skip_fail;
var no_music_image = Thumbimage.no_music_image;
var connect_channel_image = Thumbimage.connect_channel;
var no_playlist_image = Thumbimage.no_playlist;
var playlist_image = Thumbimage.playlist;
//---------------------------------------
const description = require('../bot_setting/description.json');
var queue_message = description.queue_message;
var voice_connect_message = description.voice_connect_message;
var no_voice_connect_message = description.no_voice_connect_message;
var song_added = description.song_added;
var incomplete_url = description.incomplete_url;
var yt_api_key_missing = description.yt_api_key_missing;
var empty_queue = description.empty_queue;
var no_music_play = description.no_music_play;
var player_pause = description.player_pause;
var no_song_in_queue = description.no_song_in_queue;
var in_queue = description.in_queue;
var resume_play = description.resume_play;
var queue = description.queue;
var clean_queue_txt = description.clean_queue_txt;
var disconnect_text = description.disconnect_text;
//------------------------------
const bs = require('../bot_sounds/bot_sounds.json');
var in_sound = bs.sound;
//---------------------------------------
var URLArray=[ // zufall url ergenzung wenn die suche fehlschlägt
    "FlmToFkw9W0",
    "LLB39g0ix1A",
    "3_-a9nVZYjk",
    "Mgfe5tIwOj0"];
//------------------------------
var timeout_fix = in_sound.length*100; // millisekunden * 100 = sekunden
// ermittle automatisch die incoming song länge
var timeout = timeout_fix;
//------------------------------
var bot_pause=false;
var bot_playing=false;
//------------------------------
var Warteschlange_Array = []; 
var SongTitel_Array = [];
var SongTitel_Buffer = [];
//------------------------------
const index = require("../index");
var bot = index.bot; 
//import var bot aus script index.js
//------------------------------
const ssea = require("../bot_commands/set_searchsong");
//------------------------------
var vlNr = defaultVolume;
//------------------------------

exports.get_song = function(memberchannel,message,bot_MessChannel,voiceConnection){ 

        timeout = timeout_fix;
        //setze bei jedem play den timeout auf timeout_fix sonst gibt es probleme beim spamen von play und leave
        //-----------------------------
        var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
        var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
        //-----------------------------
        if (MinQueue<0){MinQueue=0  
            // der song counter kann nicht unter 0 fallen
            return};

        exports.getsbi = function(url_mess, info_url){
 
        if (max_queue==MinQueue){ 
        // ist das max der song aufnahme erreicht dann....
            return bot_MessChannel.send(wrap(queue_message)); 
            // return message rückgabe 
        }else{

            Warteschlange_Array.push(url_mess); 
            //push url message in die Warteschlange array
            SongTitel_Buffer.push(info_url); 
            //info url message in die SongTitel array
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => (( x +  1  ) + ': ' + SongTitel_Buffer)).join('\n'); 
            //füge nummerierung beim auslesen hinzu           
            //---------------------------------------
            MinQueue++; 
            // Song counder            
            //---------------------------------------
            if(!bot_playing) memberchannel.join().then(function(connection){
                //sollte der bot nicht spielen dann connecte zum voicechannel
                //--------------------------------------- 
                bot_playing = true;
                //sag dem bot das er jetzt abspielt               
                //---------------------------------------  
                bmess.ambedMessage(voice_connect_message+" :",'```HTTP'+'\n' + message.member.voiceChannel.name + '\n```',bot_MessChannel,RandomColor,bot_name,connect_channel_image);
                // connect message   
                //---------------------------------------
                    var vol = defaultVolume*5
                    // new defaultVolume für den connect sound
                    dispatcher = connection.playFile(in_sound);
                    // dispatcher ist channel connection + play sound file
                    dispatcher.setVolume(vol); 
                    // defaultVolume*5 wenn player den sound wieder gibt

                setTimeout(function(){
                    timeout = 0;                    
                    //wenn der bpt den connect sound abgespielt hat, setze timeout auf 0          
                    play(connection,message,bot_MessChannel); 
                    // gehe zur funktion play 
                    //---------------------------------------
                }, timeout);
                //timeout wegen login_sound länge 
                              
            })//.catch(err => console.log(err));

            bmess.play_ambedMessage(song_added+" :", '```HTTP'+'\n' + SongTitel_Array + '```', bot_MessChannel, RandomColor, bot_name, play_music_image,message);
            //ist der bot nicht im voicechannel send SongTitel_Array message                     
        };
    };    
};
//---------------------------------------
exports.play_song = function (memberchannel,message,bot_MessChannel,url){

    var time = 0;
    timeout = timeout_fix
    //setze bei jedem play den timeout auf timeout_fix sonst gibt es probleme beim spamen von play und leave
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    if (MinQueue<0){MinQueue=0  
        // der song counter kann nicht unter 0 fallen
        return};

    if (max_queue==MinQueue){ // ist das max der song aufnahme erreicht dann....          
        return bot_MessChannel.send(wrap(queue_message)); // message rückgabe
    }else{

        if(!bot_playing) memberchannel.join().then(function(connection){
            //sollte der bot nicht spielen dann connecte zum voicechannel
            bot_playing=true;
            //sag dem bot das er jetzt abspielt
            //---------------------------------------                
            var vol = defaultVolume*5
            // new defaultVolume für den connect sound
            dispatcher = connection.playFile(in_sound);
            // dispatcher ist channel connection + play sound file
            dispatcher.setVolume(vol); 
            // defaultVolume*5 wenn player den sound wieder gibt 
                      
            setTimeout(function(){  
                timeout = 0;
                //wenn der bot den connect sound abgespielt hat, setze timeout auf 0          
                play(connection,message,bot_MessChannel); 
                // gehe zur funktion play 
            }, timeout);
            //timeout wegen login sound länge   
        });

        Warteschlange_Array.push(url);
        
        ytdl.getInfo(url = String(url), (error, videoInfo) => { 
        // url ausgabe information
            if (error) {
                return message.channel.send(wrap(incomplete_url)); 
                // error unvollständige url
            }
            //---------------------------------------
            time = videoInfo.length_seconds / 60; 
            //viedeo Time
            SongTitel_Buffer.push(time.toFixed(2) + " min" +" - "+ videoInfo.title); 
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => (( x +  1  ) + ': ' + SongTitel_Buffer)).join('\n');            
            //---------------------------------------
            MinQueue++; 
            // Song counder ++                       
            //---------------------------------------
            if(!bot_playing){
                // ist der bot nicht am streamen dann ...
                bmess.ambedMessage(voice_connect_message+" :",'```HTTP'+'\n' + message.member.voiceChannel.name + '\n```',bot_MessChannel,RandomColor,bot_name,connect_channel_image);
                // connect message
            };
            //---------------------------------------
            setTimeout(function(){
                return bmess.play_ambedMessage(song_added+" :", '```HTTP'+'\n' + SongTitel_Array + '```', bot_MessChannel, RandomColor, bot_name, play_music_image,message);                
            }, timeout);  
            //---------------------------------------
        })//.catch(err => console.log(err))
    };    
};
//---------------------------------------
exports.search_song = function(message,sucheVideo,bot_MessChannel,prefix) {

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

        if (!yt_api_key){
            return bot_MessChannel.send(wrap(yt_api_key_missing));
        }else{

            request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {
                var json = JSON.parse(body); 
                if (json.items==undefined){
                    return bot_MessChannel.send(wrap(yt_api_key_error));
                }else{       
                    if (!json.items[0])callback(URLArray[Math.floor(Math.random()* URLArray.length)]);  
                    else {callback(json.items[0].id.videoId);} 
                }               
            });             
        }  
    };

    getID(sucheVideo, function (id) {
        fetchVideoInfo(id, function (err, videoInfo) {
            ssea.get_url(videoInfo.url);
            console.log(videoInfo.url)         
        });
    });
};
//---------------------------------------
exports.queue =  function(message,bot_MessChannel){

    //----------
    bot_MessChannel.bulkDelete(100);
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    if (SongTitel_Array.length<1) {
        return bmess.ambedMessage("-",'```HTTP'+'\n' + no_song_in_queue + '```', bot_MessChannel, RandomColor, bot_name, no_playlist_image);
    }
    else {
        return bmess.play_ambedMessage(in_queue, '```HTTP'+'\n' + SongTitel_Array + '```', bot_MessChannel, RandomColor, bot_name, playlist_image,message)
    }
};
//---------------------------------------
exports.clean_queue = function(message,bot_MessChannel){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if(SongTitel_Array.length>0){
        message.guild.voiceConnection.player.dispatcher.destroyed = true; // destroy das laufende lied
        // nach dem nächsten play xxx geht der bot wieder in funktion play und bekommt automatisch destroy = false
        // die funktion destroyt alles connect info, momentaner stream usw... alle infos sind weg.  
        message.guild.voiceConnection.player.dispatcher.resume(); 
        // resume stream funktion sonst bleibt der bot auf play stream
        Warteschlange_Array = [], SongTitel_Array = [],SongTitel_Buffer = []; 
        //leere alle arrays
        bot_playing=false;
        // sag dem bot er spielt keine music mehr
        //---------------------------------------
        bot_defaultVolume_option=true; 
        //ist die warteschlane geleert geht der bot auf default volume 
        MinQueue=0; 
        // Queue auf null setzen, warteschlange ist leer                              
        bmess.ambedMessage(clean_queue_txt,'```HTTP'+'\n' + "۝" + '```', bot_MessChannel,RandomColor,bot_name,queue_clean_image);
    }else bmess.ambedMessage(empty_queue,'```HTTP'+'\n' + "؝" + '```', bot_MessChannel,RandomColor,bot_name,skip_fail_image);
};
//---------------------------------------
exports.leave = function(bot_MessChannel,message){

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //----------------------------- 
    if(!message.guild.voiceConnection){
        bmess.ambedMessage(no_voice_connect_message,'```HTTP'+'\n' + "❌" + '```', bot_MessChannel,RandomColor,bot_name,no_voice_connect_image);
    }else{
        bot_playing=false;
        // wenn man den bot zu schnell beendet bekommt dieser ein error da der url parameter nichtmer existiert
        Warteschlange_Array = [];
        // player bekommt disconnect, hat aber noch ein wert in der Warteschlange_Array.    
        bot_pause=false; 
        //wert muss hier resetet werden, probleme mit clean und leave in unterschiedlichen reihenfolge               
        bmess.ambedMessage(disconnect_text,'```HTTP'+'\n' + "♫♪.|̲̅̅●̲̅̅|̲̅̅=̲̅̅|̲̅̅●̲̅̅||.♫♪" + '```', bot_MessChannel,RandomColor,bot_name,bot_leave_image);
        // leave message
        //-----------------------------
        message.guild.voiceConnection.disconnect(); 
        // disconect voice channel
    }
};
//---------------------------------------
exports.skip = function(message,bot_MessChannel,voiceConnection){
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //----------------------------- 
    if(!voiceConnection){
        return bmess.ambedMessage(no_voice_connect_message,'```HTTP'+'\n' + "❌" + '```', bot_MessChannel,RandomColor,bot_name,no_voice_connect_image);
    }else if(!bot_playing){
        return bmess.ambedMessage(empty_queue,'```HTTP'+'\n' + "❗" + '```', bot_MessChannel,RandomColor,bot_name,skip_fail_image); 
    }else if(dispatcher){
        dispatcher.end(); 
        // geh zur funktion end
    }; 
};
//---------------------------------------
exports.pause = function(message,prefix,voiceConnection,bot_MessChannel){

    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
 
    // Get the voice connection.
    if (voiceConnection === null) return bmess.ambedMessage("-",'```HTTP'+'\n' + no_music_play + '```', bot_MessChannel,RandomColor,bot_name,music_not_playing_image);
    
    // Pause.    
    const dispatcher = voiceConnection.player.dispatcher;
    if (!dispatcher.play&&!bot_pause) {
        dispatcher.pause(bmess.pause_ambedMessage("-",'```HTTP'+'\n' + '♊' + '```', bot_MessChannel,RandomColor,bot_name,pause_image));
        bot_pause=true; 
    }else{return bmess.ambedMessage("-",'```HTTP'+'\n' + player_pause + '```', bot_MessChannel,RandomColor,bot_name,music_not_playing_image);}
}; 
//---------------------------------------
exports.resume = function(message,prefix,voiceConnection,bot_MessChannel){
  
    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    // Get the voice connection.
    if (voiceConnection === null) return bmess.ambedMessage("؎",'```HTTP'+'\n' + no_music_play + '```', bot_MessChannel,RandomColor,bot_name,music_not_playing_image);

    // Resume.    
    const dispatcher = voiceConnection.player.dispatcher;
    if (dispatcher.pause&&bot_pause) {
        dispatcher.resume(bmess.ambedMessage("-",'```HTTP'+'\n' + resume_play + '```', bot_MessChannel,RandomColor,bot_name,resume_image));
        bot_pause=false;
        //----------
        return bot_MessChannel.send(prefix+set_queue);
        //---------- 
    }else{return;};
};
//---------------------------------------
exports.volume = function(message,VolumeNr,voiceConnection){
    //----------
    setTimeout(function(){
        message.delete();
    }, 500);
    //----------    
    if (voiceConnection === null) return message.channel.send(wrap(no_music_play)); 
    // ist voiceConnection = 0 return message
    const dispatcher = voiceConnection.player.dispatcher; 
    // initial dispatcher
    if (VolumeNr < 11){ 
        // ist max Volume kleiner als
        if (VolumeNr > 0 ){ 
            // ist max Volume größer als              
            dispatcher.setVolume(VolumeNr/20);
            vlNr = VolumeNr/20;      
        }else{return};  // wert darüber oder darunter ist     
    }else{return}; // wert darüber oder darunter ist 
};
//---------------------------------------
function play(connection,message,bot_MessChannel){

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if (!bot_playing){ 
        // check bot play bei abrupten beenden des bots TypeError: Parameter "url" must be a string, not undefined
        // da dieser in playStream geht aber keine url lesen kann
    }else{       
        dispatcher = connection.playStream(ytdl(Warteschlange_Array[0], { filter: "audioonly" }))
        //stream die erste stelle der array.. also [0]
        .on("end", () => { 
            console.log("song end");
        })
        .on("error", (error) => {
            console.error(error); 
        });
    }
    
    //-----------------------------
    Warteschlange_Array.shift(); //shift gleich die erste stelle in der array...  
    // bei einem lead ist der bot eigentlich schon bei disconnect nach dem abspielen des ersten liedes
    //-----------------------------
    if (vlNr>defaultVolume){        
        dispatcher.setVolume(vlNr); 
        // vlNr volume solange kein - disconnect gemacht wurde
    }else{
        dispatcher.setVolume(defaultVolume); 
        // defaultVolume volume wenn play stream resetet wird - disconnect
    };        

    dispatcher.on("end",function(){
        if(Warteschlange_Array[0]){ 
        // solange noch etwas in der Warteschlange_Array ist, shift diese          
            MinQueue-- 
            // -- queue aus der warteschlange
            //-----------------------------
            bot_MessChannel.bulkDelete(100);
            //----------------------------- 
            play(connection,message,bot_MessChannel),SongTitel_Buffer.shift(); 
            // replay and shift SongTitel_Buffer um eine stelle       
            SongTitel_Array = SongTitel_Buffer.map((SongTitel_Buffer, x) => ((x + 1) + ': ' + SongTitel_Buffer)).join('\n'); 
            // füge nummerierung zur SongTitel_Array hinzu                                
            //--------            
            bot_playing=true; //sag dem bot das er jetz spielt
            //sag dem bot das er jetzt abspielt  
            //--------
            return bmess.play_ambedMessage(queue,'```HTTP'+'\n' + SongTitel_Array + '```',bot_MessChannel,RandomColor,bot_name,play_forward_image,message); // message ausgabe - Warteschlange SongTitel_Array
        }else{connection.disconnect() 
            // ist Warteschlange_Array leer disconnect und setze alles zurück 
            //----------------------------- 
            bot_playing=false, bot_pause=false; 
            // reset bot_playing, bot_pause
            //--------            
            MinQueue=0; 
            // reset queue
            //--------
            Warteschlange_Array = [],SongTitel_Array = [],SongTitel_Buffer = []; 
            // setze alle arrays auf null fals noch etwas darin sein sollze
            //--------
            timeout = timeout_fix;
            // reset timeout
            //--------
            vlNr=defaultVolume; 
            // default volume
            //--------
            return bot_MessChannel.send({files: ["./Images/no_music_image.png"]});  // send leave image
            // es gibt noch proleme beim spamen der play und leave funktion 
            // muss vielleicht als url und nicht als image send ausgeführt werden 
            //-----------------------------                                      
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