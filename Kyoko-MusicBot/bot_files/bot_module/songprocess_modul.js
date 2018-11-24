const ytdl = require("ytdl-core"),
    fs = require("fs"),
    mpm = require("./music_play_modul"),
    sm = require("./songlist_modul"),
    rw = require("./read_write_modul")  
//------------------------------
const Songlisten_pfad ='./user_songlist/'
const urlInfo = '-url_info.json'
const urlInput = '-url_input.json'
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var language = setting.language
//------------------------------
const lg = require('../language/language - '+language+'.json')
var no_file_created = lg.no_file_created,
    enter_voice_channel = lg.enter_voice_channel,
    delete_your_name = lg.delete_your_name,
    thats_not_work = lg.thats_not_work,
    only_number = lg.only_number,
    incomplete_url = lg.incomplete_url,
    only_jt_url = lg.only_jt_url,
    many_blank_spaces = lg.many_blank_spaces,
    max_songlist_range = lg.max_songlist_range,
    file_created = lg.file_created,
    song_saved =lg.song_saved,
    song_delete =lg.song_delete
//------------------------------
/**
* @param  auth_id the author id
* @param  message message from channel
* @param  bot client
* @param  slice slice the commando
* @param  prefix the prefix
* @param  botchannel the botchannel name    
* @param  set_playsong slice commando
* @param  content_array a array return from json_read
*/
exports.get_song_at_list = function(auth_id,message,bot,slice,prefix,botchannel,set_playsong,content_array) {
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete()
            return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created))  
        }        
        var user_url =  rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
        var user_url_info = rw.json_read(Songlisten_pfad+auth_id+urlInfo,content_array)

        var songlength = user_url.length            
        var get_songnumber = message.content.slice(slice)
        var songlengthmsg = user_url.length-1
 
        if(get_songnumber.search(/^[^a-z]+/)){
            return bot.channels.find("name",botchannel).send(wrap(only_number+" 1 - "+songlength))   
        }else{ 
            if (get_songnumber==0){
                return bot.channels.find("name",botchannel).send(wrap(thats_not_work)) 
            } 
            else if(get_songnumber<songlength){
                if(message.content.startsWith(prefix+set_playsong)) {
                    var i = 0                    
                    var SongListVar = setInterval(SongListTimer, 1)  
                    function SongListTimer() 
                    { 
                        if(get_songnumber==i){
                                                    
                            var mess_url = user_url[i]
                            var info_url = user_url_info[i]
                            clearInterval(SongListVar),i=0  
                                                               
                            return module.exports.temp={
                                mess: mess_url,
                                info: info_url,  
                                // url und info der songliste werden zum song modul geschickt
                                songlengthmsg: user_url.length
                                // die songlisten länge geht zurück zu set_playsong.. überprüfung getNumber < als
                            }                                                          
                        }
                        i++
                    }                                       
                } 
            }else{                 
                return bot.channels.find(channel => channel.name === botchannel).send(wrap(max_songlist_range +" 1 - "+songlengthmsg))                    
            }
        }            
    })       
},
        
//------------------------------
/**
* @param  auth_id the author id
* @param  message message from channel
* @param  bot client
* @param  slice slice the commando
* @param  prefix the prefix
* @param  set_randomsong the commando
* @param  botchannel the botchannel name
* @param  in_voicechannel is member in voicechannel?
* @param  bot_MessChannel is member write in bot message channel?
* @param  content_array array return from json_read
*/
exports.Random_song = function(auth_id,message,bot,prefix,set_randomsong,botchannel,voicechannel,bot_MessChannel,content_array) { 
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete()
            return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created))  
        }
        if(message.content.startsWith(prefix+set_randomsong)) {
            
            user_url = rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
            var url_x = user_url[1]+[Math.floor(Math.random() * user_url.length-1)]
            console.log(url_x)
            voicechannel.join()
            mpm.play_song(voicechannel, message,bot_MessChannel,url_x)
        }
    })
},
//---------------------------------------
/**
* @param  auth the author name
* @param  auth_id the author id
* @param  message message from channel
* @param  bot client
* @param  comando bot commando [ prefix + x ] comando
* @param  slice slice the commando
* @param  botchannel the botchannel name
* @param  content_array array return from json_read
*/
exports.save_song = function(auth,auth_id,message,bot,comando,slice,botchannel){

    var user_url = []
    var user_url_info = []

    user_url[0] = auth
    user_url_info[0] = auth

    var msg = message.content.toLowerCase();

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {        
            var then_do = new Promise(function(resolve, reject) {                
                rw.json_write(Songlisten_pfad+auth_id+urlInput,user_url) 
                rw.json_write(Songlisten_pfad+auth_id+urlInfo,user_url_info) 
                setTimeout(function(){
                    resolve('Success!')
                    // bot.channels.find(channel => channel.id === botchannel).send('```\n'+file_created+'\n```')
                    bot.users.get(auth_id).send('```\n'+file_created+'\n```')
                }, 250)
            })
            then_do.then(function(value) {               
                return save_song_do_next(auth,auth_id,message,bot,comando,slice,botchannel,msg)                   
            })           
        } else {
            return save_song_do_next(auth,auth_id,message,bot,comando,slice,botchannel,msg)           
        }
    }) 
}

function save_song_do_next(auth,auth_id,message,bot,comando,slice,botchannel,msg,content_array){

    var user_url = []
    var user_url_info = []

    var i=0
    var words_url = rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
    var words_info = rw.json_read(Songlisten_pfad+auth_id+urlInfo,content_array)
    var url_message = message.content.slice(slice)
    var url_messageInfo = url_message
    words_url[0] = auth
    words_info[0] = auth

    if (url_message.indexOf("h")>0){
        // return bot.channels.find(channel => channel.id === botchannel).send('```\n' +many_blank_spaces+ '\n```')
        return bot.users.get(auth_id).send('```\n' +many_blank_spaces+ '\n```')
    }
    else(message.content.startsWith(comando)) 
    {
        if(msg.includes("https://www.youtube.com"))
        {                    
                    
            var SongListVar = setInterval(SongListTimer, 1)  
            function SongListTimer() 
            {             
                user_url.push(words_url[i])
                user_url_info.push(words_info[i])                

                if (i==words_url.length-1)
                {         
                    clearInterval(SongListVar),i=0
                    
                    ytdl.getInfo(url_messageInfo, (error, videoInfo) => {
                        if (error) {                             
                            // return message.channel.send(wrap(incomplete_url)) 
                            return bot.users.get(auth_id).send(wrap(incomplete_url)) // error unvollständige url                           
                        }
                        else {
                            var time = videoInfo.length_seconds / 60 
                            //viedeo Time                            
                            url_messageInfo = +time.toFixed(1)+" min"+" - "+videoInfo.title                                
                            user_url_info.push(url_messageInfo)
                            user_url.push(url_message)                            
                        } 

                        rw.json_write(Songlisten_pfad+auth_id+urlInput,user_url) 
                        rw.json_write(Songlisten_pfad+auth_id+urlInfo,user_url_info) 
                        setTimeout(function(){
                            user_url_info = [] 
                            user_url = [] 
                            // return bot.channels.find(channel => channel.id === botchannel).send('```\n' +url_messageInfo+'\n'+">> "+song_saved + '\n```')
                            return bot.users.get(auth_id).send('```\n' +url_messageInfo+'\n'+">> "+song_saved + '\n```')
                        }, 250)
                    })                    
                }
                i++ 
            }                
        }else{
            message.delete()
            // return bot.channels.find(channel => channel.id === botchannel).send('```\n' +only_jt_url+ '\n```')
            return bot.users.get(auth_id).send('```\n' +only_jt_url+ '\n```')
        }  
    }
}
//------------------------------
/**
* @param  auth the author name
* @param  auth_id the author id
* @param  message message from channel
* @param  bot client
* @param  botchannel the botchannel name
*/
exports.songliste = function(auth,auth_id,message,bot,botchannel){

    fs.exists(Songlisten_pfad+auth_id+urlInfo,(exists)=> {
        if (!exists) {
            message.delete()
            // return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created))
            return bot.users.get(auth_id).send(wrap(no_file_created))
        }

        var Info_buffer = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)
        var words_info = JSON.parse(Info_buffer)
        var arrayLength = words_info.length
        //------------------------------ 
        viertel_f = Math.ceil(arrayLength/4)-arrayLength/4+1 // gibt dem wert aus 1, 1.25, 1.5, 1.75        
        
        if(viertel_f==1){
            halb_f = Math.ceil(arrayLength/2)-arrayLength/2} //ist wert bei 1 = 0
        else if(viertel_f==1.5){
            halb_f = Math.ceil(arrayLength/2)-arrayLength/2} //ist wert bei 1.5 = 0
        else if(viertel_f==1.75){
            halb_f = Math.ceil(arrayLength/2)-arrayLength/2} //ist wert bei 1.75 = 0
        else {halb_f = Math.ceil(arrayLength/2)-arrayLength/2-0.5} //ist wert bei 1.25 = -0.5
        
        dreiv_f = viertel_f+halb_f // ausabe = viertel_f + halb_f
        //------------------------------ 
        viertel = Math.floor(arrayLength/4+viertel_f) 
        halb = Math.floor(arrayLength/2+viertel_f+halb_f)
        dreiv = Math.floor(arrayLength+viertel_f+dreiv_f-viertel)
        //------------------------------
        words_info_1 = JSON.parse(Info_buffer).splice(0,viertel)
        words_info_2 = JSON.parse(Info_buffer).splice(viertel,arrayLength/4)
        words_info_3 = JSON.parse(Info_buffer).splice(halb,halb/2)
        words_info_4 = JSON.parse(Info_buffer).splice(dreiv,arrayLength)
        //need the file buffer for math
        //------------------------------ 
        var i =0
        var dosome = setInterval(dosomeTimer, 1)  
        function dosomeTimer() 
        {
            if (i==0)
            {
                sm.sl_modul(botchannel,words_info_1,words_info_1.length,0,bot,1,message)
            }
            if (i==10)
            {
                sm.sl_modul(botchannel,words_info_2,words_info_2.length,viertel,bot,2,message)
            }
            if (i==20)
            {
                sm.sl_modul(botchannel,words_info_3,words_info_3.length,halb,bot,3,message)
            }
            if (i==30)
            {
                sm.sl_modul(botchannel,words_info_4,words_info_4.length,dreiv,bot,4,message)
                clearInterval(dosome),i=0
            }
            i++
        }
        return 
    })
}
//------------------------------
/**
* @param  auth the author name
* @param  auth_id the author id
* @param  message message from channel
* @param  bot client
* @param  comando bot commando [ prefix + x ] comando
* @param  slice slice the commando
* @param  botchannel the botchannel name
* @param  content_array array return from json_read
*/
exports.delete_song = function(auth,auth_id,message,bot,comando,slice,botchannel,content_array) {

    var user_url = []
    var user_url_info = []

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {            
            // return bot.channels.find(channel => channel.id ===  botchannel).send(wrap(no_file_created))  
            return bot.users.get(auth_id).send(wrap(no_file_created))
        }
        var i=0
        var words_url = rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
        var words_info = rw.json_read(Songlisten_pfad+auth_id+urlInfo,content_array)
        var get_songnumber = message.content.slice(slice)

        words_url[0] = auth
        words_info[0] = auth
        if (message.content.startsWith(comando)) {
            var SongListVar = setInterval(SongListTimer, 1)  
            function SongListTimer() 
            {  
            
                user_url.push(words_url[i])
                user_url_info.push(words_info[i])
                if (i==words_url.length-1)
                { 
                    clearInterval(SongListVar),i=0                    
                    var lead = user_url_info[get_songnumber]
                    if (get_songnumber==0){
                        user_url_info = [] 
                        uuser_urll = []
                        // return bot.channels.find(channel => channel.id === botchannel).send('```\n' +delete_your_name+ '\n```')
                        return bot.users.get(auth_id).send('```\n' +delete_your_name+ '\n```')
                    }else{

                        user_url.splice(get_songnumber, 1) //löscht 1 gewünschte zeile aus der array
                        user_url_info.splice(get_songnumber, 1) //löscht 1 gewünschte zeile aus der array
                        rw.json_write(Songlisten_pfad+auth_id+urlInput,user_url) 
                        rw.json_write(Songlisten_pfad+auth_id+urlInfo,user_url_info) 
                        setTimeout(function(){
                            user_url_info = [] 
                            user_url = [] 
                            // return bot.channels.find(channel => channel.id === botchannel).send('```\n'+get_songnumber+" : "+lead+'\n'+" >> "+song_delete+ '\n```')
                            return bot.users.get(auth_id).send('```\n'+get_songnumber+" : "+lead+'\n'+" >> "+song_delete+ '\n```')
                        }, 250)
                    }
                }
                i++     
            }    
        }
        return
    })    
}

//---------------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//---------------------------------------