const ytdl = require("ytdl-core")
const fs = require("fs")
const mpm = require("./music_play_modul")
const sm = require("./songlist_modul")
const rw = require('./read_write_modul.js')
//------------------------------
const Songlisten_pfad ='./user_songlist/'
const urlInfo = '-url_info.json'
const urlInput = '-url_input.json'
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var language = setting.language
//------------------------------
const lg = require('../language/language - '+language+'.json')
var no_file_created = lg.no_file_created
var enter_voice_channel = lg.enter_voice_channel
var delete_your_name = lg.delete_your_name
var thats_not_work = lg.thats_not_work
var only_number = lg.only_number
var incomplete_url = lg.incomplete_url
var only_jt_url = lg.only_jt_url
var many_blank_spaces = lg.many_blank_spaces
var max_songlist_range = lg.max_songlist_range
var file_created = lg.file_created
var song_saved =lg.song_saved
var song_delete =lg.song_delete
//------------------------------
/**
* @param  auth_id the author id
* @param  message message from channel
* @param  bot client
* @param  slice slice the commando
* @param  prefix prefix commando
* @param  botchannel the botchannel name
* @param  in_voicechannel is member in voicechannel?
* @param  set_playsong slice commando
* @param  content_array array return from json_read
*/
exports.get_song_at_list = function(auth_id,message,bot,slice,prefix,botchannel,in_voicechannel,set_playsong,content_array) {

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete()
            return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created))  
        }        

        url =  rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
        url_info = rw.json_read(Songlisten_pfad+auth_id+urlInfo,content_array)

        var songlength = url.length
        var songlengthmsg = url.length-1
        var getNumber = message.content.slice(slice)
        
        if(!in_voicechannel){
            return bot.channels.find(channel => channel.name === botchannel).send(wrap(enter_voice_channel))
        }else if(getNumber.search(/^[^a-z]+/)){
            return bot.channels.find("name",botchannel).send(wrap(only_number+" 1 - "+songlength))   
        }else{ 

            if (getNumber==0){
                return bot.channels.find("name",botchannel).send(wrap(thats_not_work)) 
            } 
            else if(getNumber<songlength){
                if(message.content.startsWith(prefix+set_playsong)) {
                    var i = 0                    
                    var SongListVar = setInterval(SongListTimer, 1)  
                    function SongListTimer() 
                    { 
                        if(getNumber==i){
                                                        
                            var mess_url = url[i]
                            var info_url = url_info[i]                       
                            mpm.getsbi(mess_url,info_url)
                            clearInterval(SongListVar),i=0
                        }
                        i++
                    }                
                } 
            }else{
                return bot.channels.find(channel => channel.name === botchannel).send(wrap(max_songlist_range +" 1 - "+songlengthmsg)) 
            }
        }
    })       
}
//------------------------------
/**
* @param  auth_id the author id
* @param  message message from channel
* @param  bot client
* @param  slice slice the commando
* @param  prefix prefix commando
* @param  botchannel the botchannel name
* @param  in_voicechannel is member in voicechannel?
* @param  bot_MessChannel is member write in bot message channel?
* @param  content_array array return from json_read
*/
exports.Random_song = function(auth_id,message,bot,prefix,botchannel,voicechannel,bot_MessChannel) {

    var url_mess = 0

    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6)
    //---------------------------------------      
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete()
            return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created))  
        }
        else if (!voicechannel){
            return bot.channels.find(channel => channel.name === botchannel).send(wrap(enter_voice_channel))
        }else if(message.content.startsWith(prefix+set_randomsong)) {
            
            url =  rw.json_read(Songlisten_pfad+auth_id+urlInput,content_array)
            var url_x = url[Math.floor(Math.random() * url.length)]
            voicechannel.join()
            mpm.play_song(in_voicechannel, message,bot_MessChannel,url_x)
        }
    })
}
//---------------------------------------
/**
* @param  auth the author name
* @param  auth_id the author id
* @param  message message from channel
* @param  bot client
* @param  comando bot commando [ prefix + x ] comando
* @param  slice slice the commando
* @param  botchannel the botchannel name
*/
exports.save_song = function(auth,auth_id,message,bot,comando,slice,botchannel){

    var url = []
    var url_info = []

    url[0] = auth
    url_info[0] = auth

    var msg = message.content.toLowerCase();

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
           
            bot.channels.find(channel => channel.id === botchannel).send('```\n'+file_created+'\n```')
            var then_do = new Promise(function(resolve, reject) {
                
                fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                {
                    if (err)
                        throw err
                })        
                fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                {
                    resolve('Success!')
                    if (err)
                        throw err
                })
            })
            then_do.then(function(value) {               
                save_song_do_next(auth,auth_id,message,bot,comando,slice,botchannel,msg)                   
            })           
        } else {
            save_song_do_next(auth,auth_id,message,bot,comando,slice,botchannel,msg)            
        }
    }) 
}

function save_song_do_next(auth,auth_id,message,bot,comando,slice,botchannel,msg){

    var url = []
    var url_info = []

    var i=0
    var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput) 
    var url_info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)    
    var words_url = JSON.parse(url_buffer)
    var words_info = JSON.parse(url_info_buffer)

    var url_message = message.content.slice(slice)

    var url_messageInfo = url_message

    words_url[0] = auth
    words_info[0] = auth

    if (url_message.indexOf("h")>0){
        return bot.channels.find(channel => channel.id === botchannel).send('```\n' +many_blank_spaces+ '\n```')
    }
    else(message.content.startsWith(comando)) 
    {
        if(msg.includes("https://www.youtube.com"))
        {                    
                    
            var SongListVar = setInterval(SongListTimer, 1)  
            function SongListTimer() 
            {             
                url.push(words_url[i])
                url_info.push(words_info[i])                

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
                            url_info.push(url_messageInfo)
                            url.push(url_message)                            
                        } 

                        fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                        {   
                            if (err)
                                throw err
                            fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                            {
                                if (err)
                                    throw err  
                                url_info = [] 
                                url = []
                                
                                return bot.channels.find(channel => channel.id === botchannel).send('```\n' +url_messageInfo+'\n'+">> "+song_saved + '\n```')
                                
                            })                            
                        })                                                                                 
                    })                    
                }
                i++ 
            }                
        }else{
            message.delete()
            return bot.channels.find(channel => channel.id === botchannel).send('```\n' +only_jt_url+ '\n```')
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
            return bot.channels.find(channel => channel.name === botchannel).send(wrap(no_file_created))
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
        var viertel = Math.floor(arrayLength/4+viertel_f) 
        var halb = Math.floor(arrayLength/2+viertel_f+halb_f)
        var dreiv = Math.floor(arrayLength+viertel_f+dreiv_f-viertel)
        //------------------------------
        var words_info_1 = JSON.parse(Info_buffer).splice(0,viertel)
        var words_info_2 = JSON.parse(Info_buffer).splice(viertel,arrayLength/4)
        var words_info_3 = JSON.parse(Info_buffer).splice(halb,halb/2)
        var words_info_4 = JSON.parse(Info_buffer).splice(dreiv,arrayLength)
        //------------------------------ 
        //console.log(viertel_f,words_info.length,arrayLength," - math floor length")         

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
*/
exports.delete_song = function(auth,auth_id,message,bot,comando,slice,botchannel) {

    var url = []
    var url_info = []
  
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {            
            return bot.channels.find(channel => channel.id ===  botchannel).send(wrap(no_file_created))  
        }
        var i=0
        var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput) 
        var info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)    
        var words_url = JSON.parse(url_buffer)
        var words_info = JSON.parse(info_buffer)
        var getNumber = message.content.slice(slice)

        words_url[0] = auth
        words_info[0] = auth
        if (message.content.startsWith(comando)) {
            var SongListVar = setInterval(SongListTimer, 1)  
            function SongListTimer() 
            {  
            
                url.push(words_url[i])
                url_info.push(words_info[i])
                if (i==words_url.length-1)
                { 
                    clearInterval(SongListVar),i=0                    
                    var lead = url_info[getNumber]
                    if (getNumber==0){
                        url_info = [] 
                        url = []
                        return bot.channels.find(channel => channel.id === botchannel).send('```\n' +delete_your_name+ '\n```')
                    }else{

                        url.splice(getNumber, 1) //löscht 1 gewünschte zeile aus der array
                        url_info.splice(getNumber, 1) //löscht 1 gewünschte zeile aus der array

                        fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                        {
                            fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                            {
                                if (err)
                                    throw err
                                url_info = [] 
                                url = []
                                return bot.channels.find(channel => channel.id === botchannel).send('```\n'+getNumber+" : "+lead+'\n'+" >> "+song_delete+ '\n```')
                            })
                        })
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