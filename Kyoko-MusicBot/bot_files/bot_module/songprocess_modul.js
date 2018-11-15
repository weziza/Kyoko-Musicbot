const ytdl = require("ytdl-core"),
    fs = require("fs"),
    mpm = require("./music_play_modul"),
    sm = require("./songlist_modul"),
    rw = require('./read_write_modul.js'),
    wrt = require('./write_temp_file_modul.js')
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
var songlength,
    songlengthmsg,
    get_songnumber,
    mess_url,
    info_url,
    arrayLength,
    viertel,
    halb,
    dreiv,
    words_info_1,
    words_info_2,
    words_info_3,
    words_info_4

var user_url = [],
    user_url_info = []
//------------------------------
module.exports={    
    /**
    * @param  auth_id the author id
    * @param  message message from channel
    * @param  bot client
    * @param  slice slice the commando
    * @param  prefix the prefix
    * @param  botchannel the botchannel name
    * @param  in_voicechannel is member in voicechannel?
    * @param  set_playsong slice commando
    * @param  content_array array return from json_read
    */
    get_song_at_list: get_song_at_list = function(auth_id,message,bot,slice,prefix,botchannel,in_voicechannel,set_playsong,content_array) {

        fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
            if (!exists) {
                message.delete()
                return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created)),exp_main()  
            }        

            user_url =  rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
            user_url_info = rw.json_read(Songlisten_pfad+auth_id+urlInfo,content_array)

            songlength = user_url.length
            songlengthmsg = user_url.length-1
            get_songnumber = message.content.slice(slice)
            
            if(!in_voicechannel){
                return bot.channels.find(channel => channel.name === botchannel).send(wrap(enter_voice_channel)),exp_main()
            }else if(get_songnumber.search(/^[^a-z]+/)){
                return bot.channels.find("name",botchannel).send(wrap(only_number+" 1 - "+songlength)),exp_main()   
            }else{ 

                if (get_songnumber==0){
                    return bot.channels.find("name",botchannel).send(wrap(thats_not_work)),exp_main() 
                } 
                else if(get_songnumber<songlength){
                    if(message.content.startsWith(prefix+set_playsong)) {
                        var i = 0                    
                        var SongListVar = setInterval(SongListTimer, 1)  
                        function SongListTimer() 
                        { 
                            if(get_songnumber==i){
                                                            
                                mess_url = user_url[i]
                                info_url = user_url_info[i]                                                
                                module.exports.temp={
                                    mess: mess_url,
                                    info: info_url  
                                }
                                clearInterval(SongListVar),i=0
                            }
                            i++
                        } 
                        exp_main()               
                    } 
                }else{
                    return bot.channels.find(channel => channel.name === botchannel).send(wrap(max_songlist_range +" 1 - "+songlengthmsg)),exp_main() 
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
    Random_song: Random_song = function(auth_id,message,bot,prefix,set_randomsong,botchannel,voicechannel,bot_MessChannel,content_array) {
        var url_mess = 0
        //---------------------------------------
        var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
        var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
        //---------------------------------------      
        fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
            if (!exists) {
                message.delete()
                return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created)),exp_main()  
            }
            else if (!voicechannel){
                return bot.channels.find(channel => channel.name === botchannel).send(wrap(enter_voice_channel)),exp_main()
            }else if(message.content.startsWith(prefix+set_randomsong)) {
                
                user_url = rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
                var url_x = user_url[Math.floor(Math.random() * user_url.length)]
                voicechannel.join()
                exp_main()
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
    save_song: save_song = function(auth,auth_id,message,bot,comando,slice,botchannel){

        user_url = []
        user_url_info = []

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
                        bot.channels.find(channel => channel.id === botchannel).send('```\n'+file_created+'\n```')
                    }, 250)
                })
                then_do.then(function(value) {               
                    return save_song_do_next(auth,auth_id,message,bot,comando,slice,botchannel,msg),exp_main()                   
                })           
            } else {
                return save_song_do_next(auth,auth_id,message,bot,comando,slice,botchannel,msg),exp_main()           
            }
        }) 
    },

    save_song_do_next: save_song_do_next = function(auth,auth_id,message,bot,comando,slice,botchannel,msg,content_array){

        user_url = []
        user_url_info = []

        var i=0
        words_url = rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
        words_info = rw.json_read(Songlisten_pfad+auth_id+urlInfo,content_array)
        var url_message = message.content.slice(slice)
        var url_messageInfo = url_message
        words_url[0] = auth
        words_info[0] = auth

        if (url_message.indexOf("h")>0){
            return bot.channels.find(channel => channel.id === botchannel).send('```\n' +many_blank_spaces+ '\n```'),exp_main()
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
                                return message.channel.send(wrap(incomplete_url)) // error unvollständige url                            
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
                                return bot.channels.find(channel => channel.id === botchannel).send('```\n' +url_messageInfo+'\n'+">> "+song_saved + '\n```'),exp_main()
                            }, 250)
                        })                    
                    }
                    i++ 
                }                
            }else{
                message.delete()
                return bot.channels.find(channel => channel.id === botchannel).send('```\n' +only_jt_url+ '\n```'),exp_main()
            }  
        }
    },
    //------------------------------
    /**
    * @param  auth the author name
    * @param  auth_id the author id
    * @param  message message from channel
    * @param  bot client
    * @param  botchannel the botchannel name
    */
    songliste: songliste = function(auth,auth_id,message,bot,botchannel){

        fs.exists(Songlisten_pfad+auth_id+urlInfo,(exists)=> {
            if (!exists) {
                message.delete()
                return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created)),exp_main()
            }

            var Info_buffer = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)
            var words_info = JSON.parse(Info_buffer)
            arrayLength = words_info.length
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
            return exp_main()
        })
    },
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
    delete_song: delete_song = function(auth,auth_id,message,bot,comando,slice,botchannel,content_array) {

        user_url = []
        user_url_info = []
    
        fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
            if (!exists) {            
                return bot.channels.find(channel => channel.id ===  botchannel).send(wrap(no_file_created)),exp_main()  
            }
            var i=0
            words_url = rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
            words_info = rw.json_read(Songlisten_pfad+auth_id+urlInfo,content_array)
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
                            return bot.channels.find(channel => channel.id === botchannel).send('```\n' +delete_your_name+ '\n```'),exp_main()
                        }else{

                            user_url.splice(get_songnumber, 1) //löscht 1 gewünschte zeile aus der array
                            user_url_info.splice(get_songnumber, 1) //löscht 1 gewünschte zeile aus der array
                            rw.json_write(Songlisten_pfad+auth_id+urlInput,user_url) 
                            rw.json_write(Songlisten_pfad+auth_id+urlInfo,user_url_info) 
                            setTimeout(function(){
                                user_url_info = [] 
                                user_url = [] 
                                return bot.channels.find(channel => channel.id === botchannel).send('```\n'+get_songnumber+" : "+lead+'\n'+" >> "+song_delete+ '\n```'),exp_main()
                            }, 250)
                        }
                    }
                    i++     
                }    
            }
            return
        })    
    }
}
//---------------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//---------------------------------------
function exp_main()
{
    module.exports.table={ 
        songprocess_modul:{
            songlength: songlength,
            songlengthmsg: songlengthmsg,
            get_songnumber: get_songnumber,
            mess_url: mess_url,
            info_url: info_url,            
            math_variable:{ 
                arrayLength: arrayLength,
                description_length: "check length of user songlist array",
                viertel: viertel,
                halb: halb,
                dreiv: dreiv,
                description_math: "math songlist division",
                words_info_1: words_info_1,
                words_info_2: words_info_2,
                words_info_3: words_info_3,
                words_info_4: words_info_4,
                description_words: "the words message division"
            },
            arrays:{
                user_url: user_url,
                user_url_info: user_url_info              
            }
        }    
    }
    wrt.run()
}