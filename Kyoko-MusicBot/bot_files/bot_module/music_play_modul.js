const discord = require('discord.js'),
    bmess = require('./bot_message_modul'),
    ytdl = require("ytdl-core"),
    fetchVideoInfo = require("youtube-info"),
    request = require("request"),
    spm = require("./songprocess_modul.js"),
    fs = require('fs'), 
    ucm = require('./url_check_modul.js')
//---------------------------------------
const setting = require('../bot_setting/bot_setting.json')
var defaultVolume = setting.defaultVolume,
    yt_api_key = setting.yt_api_key,
    bot_name = setting.bot_name,
    max_queue = setting.max_queue,
    language = setting.language
//---------------------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_queue = commands_setting.set_queue
//---------------------------------------
const Thumbimage = require('../bot_images/Thumbimage.json')
var play_music_image = Thumbimage.play_music,
    pause_image = Thumbimage.pause,
    resume_image = Thumbimage.resume,
    play_forward_image = Thumbimage.play_forward,
    queue_clean_image = Thumbimage.queue_clean,
    skip_fail_image = Thumbimage.skip_fail,
    no_music_image = Thumbimage.no_music_image,
    connect_channel_image = Thumbimage.connect_channel,
    no_playlist_image = Thumbimage.no_playlist,
    playlist_image = Thumbimage.playlist
//------------------------------
const lg = require('../language/language - '+language+'.json')
var queue_message = lg.queue_message,
    voice_connect_message = lg.voice_connect_message,
    song_added = lg.song_added,
    incomplete_url = lg.incomplete_url,
    yt_api_key_missing = lg.yt_api_key_missing,
    empty_queue = lg.empty_queue,    
    no_song_in_queue = lg.no_song_in_queue,
    in_queue = lg.in_queue,
    resume_play = lg.resume_play,
    queue_lg_txt = lg.queue,
    clean_queue_txt = lg.clean_queue_txt,
    player_pause = lg.player_pause
//------------------------------
const bs = require('../bot_sounds/bot_sounds.json')
var conect_sound = bs.sound
//---------------------------------------
const URLArray = require("../bot_setting/no_url_setting.json")
// console.log(URLArray)
//---------------------------------------
var bot_pause=false,
    bot_playing=false,
    cleaning=false,
    vlNr = defaultVolume,
    vol,
    url_error,
    MinQueue = 0,
    timeout_fix = conect_sound.length*100, // millisekunden * 100 = sekunden
    // ermittle automatisch die incoming song länge 
    timeout = timeout_fix 
    //global variablen 
module.exports.temp={bot_playing:bot_playing}      
//------------------------------
var queue_url_array = [],
    current_queue_songtitel = [],
    queue_titel_array = []  
    //global array variable 
var resume_queue_url,
    resume_queue_url_titel
    //global variable 
//------------------------------

exports.get_song = function(voicechannel,message,bot_MessChannel){ 
    timeout = timeout_fix
    // setze bei jedem play den timeout auf timeout_fix sonst gibt es probleme beim spamen von play und leave
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if (MinQueue<0){MinQueue=0  
        // der song counter kann nicht unter 0 fallen
        return
    }

    if (max_queue==MinQueue){ 
    // ist das max der song aufnahme erreicht dann....
        return bot_MessChannel.send(wrap(queue_message)) 
        // return message rückgabe 
    }else{
        queue_url_array.push(spm.temp.mess) 
        // push url message in die Warteschlange array
        queue_titel_array.push(spm.temp.info)
        // info url message in die SongTitel array
        current_queue_songtitel = queue_titel_array.map((queue_titel_array, x) => (( x +  1  ) + ': ' + queue_titel_array)).join('\n') 
        // füge nummerierung beim auslesen hinzu           
        //---------------------------------------
        MinQueue++ 
        // Song counder            
        //---------------------------------------
        url_error = ucm.url_check(queue_url_array[0],current_queue_songtitel,queue_titel_array,bot_MessChannel,url_error)
        // check the url if it exists
        if(url_error==true){                 
            return 
        }else{
            if(!bot_playing) voicechannel.join().then(function(connection){
                // sollte der bot nicht spielen dann connecte zum voicechannel
                //--------------------------------------- 
                bot_playing = true
                // sag dem bot das er jetzt abspielt  
                module.exports.temp={bot_playing:bot_playing}              
                //---------------------------------------  
                bmess.ambedMessage(voice_connect_message+" :",'```HTTP'+'\n' + message.member.voiceChannel.name + '\n```',bot_MessChannel,RandomColor,bot_name,connect_channel_image)
                // connect message   
                //---------------------------------------
                if(!cleaning){
                    vol = defaultVolume*5
                    // new defaultVolume für den connect sound
                    dispatcher = connection.playFile(conect_sound)
                    // dispatcher ist channel connection + play sound file
                    dispatcher.setVolume(vol) 
                    // defaultVolume*5 wenn player den sound wieder gibt
                }

                setTimeout(function(){
                    timeout = 0                    
                    //wenn der bpt den connect sound abgespielt hat, setze timeout auf 0          
                    play(connection,message,bot_MessChannel) 
                    // gehe zur funktion play 
                    //---------------------------------------
                }, timeout)
                //timeout wegen logconect_sound länge 
                            
            })             
            return bmess.play_ambedMessage(song_added+" :", '```HTTP'+'\n' + current_queue_songtitel + '```', bot_MessChannel, RandomColor, bot_name, play_music_image,message)
            // ist der bot nicht im voicechannel send current_queue_songtitel message  
        }                             
    }    
}

exports.play_song = function (voicechannel,message,bot_MessChannel,url){
    var time = 0
    timeout = timeout_fix
    // setze bei jedem play den timeout auf timeout_fix sonst gibt es probleme beim spamen von play und leave
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if (MinQueue<0){MinQueue=0  
        // der song counter kann nicht unter 0 fallen
        return}          
    else if (max_queue==MinQueue){ // ist das max der song aufnahme erreicht dann....          
        return bot_MessChannel.send(wrap(queue_message)) // message rückgabe
    }else{            
        var url_error = ucm.url_check(url,current_queue_songtitel,queue_titel_array,bot_MessChannel)
        // check the url if it exists
        if(url_error==true){                 
            return 
        }else{
            if(!bot_playing) voicechannel.join().then(function(connection){
                // sollte der bot nicht spielen dann connecte zum voicechannel
                //--------------------------------------- 
                bot_playing=true
                // sag dem bot das er jetzt abspielt
                module.exports.temp={bot_playing:bot_playing} 
                //---------------------------------------                
                if(!cleaning){
                    vol = defaultVolume*5
                    // new defaultVolume für den connect sound
                    dispatcher = connection.playFile(conect_sound)
                    // dispatcher ist channel connection + play sound file
                    dispatcher.setVolume(vol) 
                    // defaultVolume*5 wenn player den sound wieder gibt
                }
                        
                setTimeout(function(){  
                    timeout = 0
                    //wenn der bot den connect sound abgespielt hat, setze timeout auf 0          
                    play(connection,message,bot_MessChannel) 
                    // gehe zur funktion play 
                }, timeout)
                //timeout wegen login sound länge   
            })
    
            queue_url_array.push(url)
            
            ytdl.getInfo(url = String(url), (error, videoInfo) => { 
            // url ausgabe information
                if (error) {
                    return message.channel.send(wrap(incomplete_url)) 
                    // error unvollständige url
                }
                //---------------------------------------
                time = videoInfo.length_seconds / 60
                
                //viedeo Time
                queue_titel_array.push(time.toFixed(2) + " min" +" - "+ videoInfo.title) 
                current_queue_songtitel = queue_titel_array.map((queue_titel_array, x) => (( x +  1  ) + ': ' + queue_titel_array)).join('\n')            
                //---------------------------------------
                MinQueue++ 
                // Song counder ++                       
                //---------------------------------------
                if(!bot_playing){
                    // ist der bot nicht am streamen dann ...
                    bmess.ambedMessage(voice_connect_message+" :",'```HTTP'+'\n' + message.member.voiceChannel.name + '\n```',bot_MessChannel,RandomColor,bot_name,connect_channel_image)
                    // connect message
                }
                //---------------------------------------
                setTimeout(function(){
                    return bmess.play_ambedMessage(song_added+" :", '```HTTP'+'\n' + current_queue_songtitel + '```', bot_MessChannel, RandomColor, bot_name, play_music_image,message)                
                }, timeout)  
                //---------------------------------------
            })
        } 
    }   
}

exports.replay_song = function (){
    var replays_url = queue_url_array
    replays_url.splice(0, 0, resume_queue_url)
    var replays_text = queue_titel_array
    replays_text.splice(0, 0, resume_queue_url_titel)
    module.exports.temp={bot_playing:bot_playing} 
    dispatcher.end() 
}

exports.leave = function(bot_MessChannel,message){

    bot_playing=false
    // wenn man den bot zu schnell beendet bekommt dieser ein error da der url parameter nichtmer existiert
    module.exports.temp={bot_playing:bot_playing} 
    queue_url_array = []
    // player bekommt disconnect, hat aber noch ein wert in der queue_url_array.    
    bot_pause=false 
    //wert muss hier resetet werden, probleme mit clean und leave in unterschiedlichen reihenfolge
    //-----------------------------        
    message.guild.voiceConnection.disconnect() 
    // disconect voice channel
}

exports.search_song = function(searchVideo,bot_MessChannel){

    //-----------------------------
    /**
    * Youtube Url Suche
    * @param {Object} getID - gibt die Youtube Id Aus
    * @param {Object} search_video - sucht nach der URL in Youtube
    * @param {Object} URLArray zufall url ergenzung wenn die suche fehlschlägt 
    */    
    function getID(query, id) {
        search_video(query, function(callback_id) {
            id(callback_id)                
        })
    }

    function search_video(query, callback) {

        if (!yt_api_key){
            return bot_MessChannel.send(wrap(yt_api_key_missing))
        }else{

            request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body){
                var json = JSON.parse(body) 
                if (json.items==undefined){
                    console.log(json.items) 
                    return bot_MessChannel.send(wrap(yt_api_key_error))
                }else{                          
                    if (!json.items[0]){callback(URLArray[Math.floor(Math.random()* URLArray.length)])} //console.log("not found") 
                    else {callback(json.items[0].id.videoId)} //console.log("found")
                }               
            })             
        } 
    }
    
    getID(searchVideo, function (id){  
        var queue_url_arrayid = "https://www.youtube.com/watch?v="+id
        url_error = ucm.url_check(queue_url_arrayid,current_queue_songtitel,queue_titel_array,bot_MessChannel,url_error)
            // check the url if it exists
            if(url_error==true){                                                           
                return module.exports.temp={ vieo: undefined,bot_playing:bot_playing}                                                        
            }else{
                fetchVideoInfo(id, function (err, videoInfo) {
                setTimeout(function(){ 
                    // console.log(videoInfo.url, "              getID  " )                    
                    return module.exports.temp={vieo: videoInfo.url, bot_playing: bot_playing} 
                }, 250) 
            });                        
        }                                                       
    })
}

exports.queue =  function(message,bot_MessChannel){

    var msz = 0
    message.channel.fetchMessages({ limit: 100 }).then(messages => {
        msz = messages.size
    }), err =>{if (err){throw err}}
    //-----------------------------
    bot_MessChannel.bulkDelete(msz)
    //-----------------------------
    module.exports.temp={bot_playing:bot_playing} 
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if (current_queue_songtitel.length<1) {
        return bmess.ambedMessage("-",'```HTTP'+'\n' + no_song_in_queue + '```', bot_MessChannel, RandomColor, bot_name, no_playlist_image)
    }
    else {
        return bmess.play_ambedMessage(in_queue, '```HTTP'+'\n' + current_queue_songtitel + '```', bot_MessChannel, RandomColor, bot_name, playlist_image,message)
    }
}

exports.clean_queue = function(message,bot_MessChannel){

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if(current_queue_songtitel.length>0){
        message.guild.voiceConnection.player.dispatcher.destroyed = true // destroy das laufende lied
        // nach dem nächsten play xxx geht der bot wieder in funktion play und bekommt automatisch destroy = false
        // die funktion destroyt alles connect info, momentaner stream usw... alle infos sind weg.  
        message.guild.voiceConnection.player.dispatcher.resume() 
        // resume stream funktion sonst bleibt der bot auf play stream
        queue_url_array = [], current_queue_songtitel = [],queue_titel_array = [] 
        //leere alle arrays
        bot_playing=false
        // sag dem bot er spielt keine music mehr
        module.exports.temp={bot_playing:bot_playing} 
        cleaning=true            
        //---------------------------------------
        bot_defaultVolume_option=true 
        //ist die warteschlane geleert geht der bot auf default volume 
        MinQueue=0 
        // Queue auf null setzen, warteschlange ist leer                              
        return bmess.ambedMessage(clean_queue_txt,'```HTTP'+'\n' + "۝" + '```', bot_MessChannel,RandomColor,bot_name,queue_clean_image)
    }else return bmess.ambedMessage(empty_queue,'```HTTP'+'\n' + "؝" + '```', bot_MessChannel,RandomColor,bot_name,skip_fail_image)
}

exports.skip = function(){

    module.exports.temp={bot_playing:bot_playing} 
    if(dispatcher){        
        dispatcher.end() 
        // geh zur funktion end
    } 
} 

exports.pause = function(voiceConnection,bot_MessChannel){
    module.exports.temp={bot_playing:bot_playing}   
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------  
    const dispatcher = voiceConnection.player.dispatcher
    if (!dispatcher.play&&!bot_pause) {
        dispatcher.pause(bmess.pause_ambedMessage("-",'```HTTP'+'\n' + player_pause + '```', bot_MessChannel,RandomColor,bot_name,pause_image))
        bot_pause=true        
    }
}

exports.resume = function(prefix,voiceConnection,bot_MessChannel){
    module.exports.temp={bot_playing:bot_playing}  
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------    
    const dispatcher = voiceConnection.player.dispatcher
    if (dispatcher.pause&&bot_pause) {
        dispatcher.resume(bmess.ambedMessage("-",'```HTTP'+'\n' + resume_play + '```', bot_MessChannel,RandomColor,bot_name,resume_image))
        bot_pause=false
        //----------
        return bot_MessChannel.send(prefix+set_queue)
        //---------- 
    }else{return}
}

exports.volume = function(VolumeNr,voiceConnection){

    const dispatcher = voiceConnection.player.dispatcher 
    // initial dispatcher
    if (VolumeNr < 11){ 
        // ist max Volume kleiner als
        if (VolumeNr > 0 ){ 
            // ist max Volume größer als              
            dispatcher.setVolume(VolumeNr/20)
            vlNr = VolumeNr/20      
        }// else{return}  // wert darüber oder darunter ist     
    }// else{return} // wert darüber oder darunter ist 
        
    return module.exports.temp={bot_playing:bot_playing} 
}

exports.see_url = function(bot_MessChannel){
    bot_MessChannel.send(wrap(resume_queue_url_titel+'\n'+resume_queue_url))
    module.exports.temp={bot_playing:bot_playing} 
}

//---------------------------------------
function play(connection,message,bot_MessChannel){

    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //-----------------------------
    if (!bot_playing){ 
        // check bot play, bei abrupten beenden des bots TypeError: Parameter "url" must be a string, not undefined
        // da dieser in playStream geht aber keine url lesen kann
    }else{ 
        dispatcher = connection.playStream(ytdl(queue_url_array[0], 
        { 
            filter: "audioonly",
            // audioBitrate: "32",
            // quality: "lowest"
        }))
        //stream die erste stelle der array.. also [0]
        resume_queue_url = queue_url_array[0]
        resume_queue_url_titel = queue_titel_array[0]
    }    
    //-----------------------------HuqOYz5zERslwDB5bgqLvBIfqJozqeWH
    queue_url_array.shift() //shift gleich die erste stelle in der array...  
    // bei einem lead ist der bot eigentlich schon bei disconnect nach dem abspielen des ersten liedes
    //-----------------------------
    if (vlNr>defaultVolume){        
        dispatcher.setVolume(vlNr) 
        // vlNr volume solange kein - disconnect gemacht wurde
    }else{
        dispatcher.setVolume(defaultVolume) 
        // defaultVolume volume wenn play stream resetet wird - disconnect
    }  

    dispatcher.on("end",function(){

        if(queue_url_array[0]){ 
        // solange noch etwas in der queue_url_array ist, shift diese          
            MinQueue-- 
            // -- queue aus der warteschlange
            //-----------------------------
            play(connection,message,bot_MessChannel),queue_titel_array.shift() 
            resume_queue_url_titel = queue_titel_array[0]
            // replay and shift queue_titel_array um eine stelle       
            current_queue_songtitel = queue_titel_array.map((queue_titel_array, x) => ((x + 1) + ': ' + queue_titel_array)).join('\n')
            // füge nummerierung zur current_queue_songtitel hinzu                                
            //--------            
            bot_playing=true //sag dem bot das er jetz spielt
            //sag dem bot das er jetzt abspielt  
            module.exports.temp={bot_playing:bot_playing} 
            //--------
            return bmess.play_ambedMessage(queue_lg_txt,'```HTTP'+'\n' + current_queue_songtitel + '```',bot_MessChannel,RandomColor,bot_name,play_forward_image,message) // message ausgabe - Warteschlange current_queue_songtitel
        }else{connection.disconnect()           
                // ist queue_url_array leer disconnect und setze alles zurück               
                //----------------------------- 
                bot_playing=false, bot_pause=false 
                // reset bot_playing, bot_pause
                module.exports.temp={bot_playing:bot_playing} 
                //--------            
                MinQueue=0 
                // reset queue
                //--------
                queue_url_array = [],current_queue_songtitel = [],queue_titel_array = [] 
                // setze alle arrays auf null fals noch etwas darin sein sollze
                resume_queue_url = 0
                resume_queue_url_titel = 0
                //--------
                timeout = timeout_fix
                // reset timeout
                //--------
                vlNr=defaultVolume 
                // default volume
                //--------
                cleaning=false 
                // default cleaning varialbe                
                //----------------------------- 
                return bot_MessChannel.send({files: ["./bot_stuff/images/no_music_image.png"]})  // send leave image
                // es gibt noch proleme beim spamen der play und leave funktion 
                // muss vielleicht als url und nicht als image send ausgeführt werden 
                //-----------------------------                            
        } 
    }).on('error', (error) => {
        console.log(error, " connection")
    })    
}
//---------------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------
function carefully(text) {
    return '```md\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//---------------------------------------