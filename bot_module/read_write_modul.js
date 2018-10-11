const ytdl = require("ytdl-core");
const fs = require("fs");
const mpm = require("./music_play_modul");
const sm = require("./songlist_modul");
//------------------------------
const Songlisten_pfad ='./songlisten/';
const urlInfo = '-url_info.json';
const urlInput = '-url_input.json';
//------------------------------
const description = require('../bot_setting/description.json');
var no_file_created = description.no_file_created;
var enter_voice_channel = description.enter_voice_channel
var delete_your_name = description.delete_your_name
var thats_not_work = description.thats_not_work
var only_number = description.only_number
var incomplete_url = description.incomplete_url
var only_jt_url = description.only_jt_url
var many_blank_spaces = description.many_blank_spaces
var max_songlist_range = description.max_songlist_range
var file_created = description.file_created
var song_saved =description.song_saved
var song_delete =description.song_delete
//------------------------------
/**
* @param {Object} auth_id
* @param {Object} message
* @param {Object} bot
* @param {Object} comando
* @param {Object} slice
* @param {Object} prefix
* @param {Object} ChatChannel
* @param {Object} memberchannel
* @param {Object} set_playsong
*/
exports.get_song_at_list = function(auth_id,message,bot,comando,slice,prefix,ChatChannel,memberchannel,set_playsong) {

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap(no_file_created));  
        }        
        
        var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput);     
        var url = JSON.parse(url_buffer);

        var url_info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)     
        var url_info = JSON.parse(url_info_buffer);

        var songlength= url.length;
        var songlengthmsg = url.length-1;
        var getNumber = message.content.slice(slice);
        
        if(!memberchannel){
            return bot.channels.find("name", ChatChannel).send(wrap(enter_voice_channel));
        }else if(getNumber.search(/^[^a-z]+/)){
            return bot.channels.find("name",ChatChannel).send(wrap(only_number+" 1 - "+songlength));   
        }else{ 

            if (getNumber==0){
                return bot.channels.find("name",ChatChannel).send(wrap(thats_not_work)); 
            } 
            else if(getNumber<songlength){
                if(message.content.startsWith(comando)) {
                    var i = 0;                    
                    var SongListVar = setInterval(SongListTimer, 1);  
                    function SongListTimer() 
                    { 
                        if(getNumber==i){
                                                        
                            var mess_url = url[i];
                            var info_url = url_info[i];                       
                            mpm.getsbi(mess_url,info_url);
                            clearInterval(SongListVar),i=0;
                        };
                        i++
                    };                
                } 
            }else{
                return bot.channels.find("name",ChatChannel).send(wrap(max_songlist_range +" 1 - "+songlengthmsg)); 
            };
        };
    });       
};
//------------------------------
/**
* @param {Object} auth_id
* @param {Object} message
* @param {Object} bot
* @param {Object} comando
* @param {Object} prefix
* @param {Object} ChatChannel
* @param {Object} memberchannel
* @param {Object} bot_MessChannel
*/
exports.Random_song = function(auth_id,message,bot,comando,prefix,ChatChannel,memberchannel,bot_MessChannel) {

    var url_mess = 0;

    //---------------------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //---------------------------------------      
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap(no_file_created));  
        }
        else if (!memberchannel){
            return bot.channels.find("name", ChatChannel).send(wrap(enter_voice_channel));
        }else if(message.content.startsWith(comando)) {
            
            var data  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput)     
            var words = JSON.parse(data)
            var url_mess = words[Math.floor(Math.random() * words.length)];
            memberchannel.join();
            mpm.play_song(memberchannel, message,bot_MessChannel,url_mess)
        };
    });
};
//---------------------------------------
/**
* @param {Object} auth
* @param {Object} auth_id
* @param {Object} message
* @param {Object} bot
* @param {Object} comando
* @param {Object} slice
* @param {Object} ChatChannel
* @param {Object} msg
*/
exports.save_song = function(auth,auth_id,message,bot,comando,slice,ChatChannel,msg){

    var url = [];
    var url_info = [];
    var url_input = [];

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            bot.channels.find("name", ChatChannel).send('```\n'+file_created+'\n```');
            var then_do = new Promise(function(resolve, reject) {
                
                fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                {
                    if (err)
                        throw err;
                });        
                fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                {
                    resolve('Success!');
                    if (err)
                        throw err;
                });
            });
            then_do.then(function(value) {
                //console.log(value);
                play_save_song(auth,auth_id,message,bot,comando,slice,ChatChannel,msg)
            });            
        } else {
            message.delete();
            play_save_song(auth,auth_id,message,bot,comando,slice,ChatChannel,msg)

        };
    });    
};

function play_save_song(auth,auth_id,message,bot,comando,slice,ChatChannel,msg){

    var url = [];
    var url_info = [];
    var url_input = [];

    var i=0;
    var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput) 
    var url_info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)    
    var words_url = JSON.parse(url_buffer);
    var words_info = JSON.parse(url_info_buffer);

    var url_message = message.content.slice(slice);

    var url_messageInfo = url_message;

    words_url[0] = auth;
    words_info[0] = auth;

    if (url_message.indexOf("h")>0){
        return bot.channels.find("name", ChatChannel).send('```\n' +many_blank_spaces+ '\n```');
    }
    else(message.content.startsWith(comando)) 
    {
        if(msg.includes("https://www.youtube.com"))
        {                    
                           
            var SongListVar = setInterval(SongListTimer, 1);  
            function SongListTimer() 
            {             
                url.push(words_url[i]);
                url_info.push(words_info[i]);

                if (i==words_url.length-1)
                {         
                    clearInterval(SongListVar),i=0;
                    
                    ytdl.getInfo(url_messageInfo, (error, videoInfo) => {
                        if (error) {
                            return message.channel.send(wrap(incomplete_url)); // error unvollständige url
                        }
                        else {
                            var time = videoInfo.length_seconds / 60; 
                            //viedeo Time                            
                            url_messageInfo = +time.toFixed(1)+" min"+" - "+videoInfo.title;                                
                            url_info.push(url_messageInfo);
                            url.push(url_message);
                        };

                        fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                        {   
                            if (err)
                                throw err;
                            fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                            {
                                if (err)
                                    throw err;  
                                url_info = []; 
                                url = [];
                                return bot.channels.find("name", ChatChannel).send('```\n' +url_messageInfo+'\n'+">> "+song_saved + '\n```');
                            });
                        });                                                             
                    }); 
                };
                i++ 
            };                
        }else{
            message.delete();
            return bot.channels.find("name", ChatChannel).send('```\n' +only_jt_url+ '\n```');
        };  
    };
}
//------------------------------
/**
* @param {Object} auth
* @param {Object} auth_id
* @param {Object} message
* @param {Object} bot
* @param {Object} ChatChannel
*/
exports.songliste = function(auth,auth_id,message,bot,ChatChannel){

    fs.exists(Songlisten_pfad+auth_id+urlInfo,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap(no_file_created));  
        }

        var Info_buffer = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo);

        var words_info = JSON.parse(Info_buffer);
        var arrayLength = words_info.length;
        //------------------------------ 
        viertel_f = Math.ceil(arrayLength/4)-arrayLength/4+1; // gibt dem wert aus 1, 1.25, 1.5, 1.75        
        
        if(viertel_f==1){
            halb_f = Math.ceil(arrayLength/2)-arrayLength/2;} //ist wert bei 1 = 0
        else if(viertel_f==1.5){
            halb_f = Math.ceil(arrayLength/2)-arrayLength/2;} //ist wert bei 1.5 = 0
        else if(viertel_f==1.75){
            halb_f = Math.ceil(arrayLength/2)-arrayLength/2;} //ist wert bei 1.75 = 0
        else {halb_f = Math.ceil(arrayLength/2)-arrayLength/2-0.5;}; //ist wert bei 1.25 = -0.5
           
        dreiv_f = viertel_f+halb_f; // ausabe = viertel_f + halb_f
        //------------------------------ 
        var viertel = Math.floor(arrayLength/4+viertel_f); 
        var halb = Math.floor(arrayLength/2+viertel_f+halb_f);
        var dreiv = Math.floor(arrayLength+viertel_f+dreiv_f-viertel);
        //------------------------------
        var words_info_1 = JSON.parse(Info_buffer).splice(0,viertel);
        var words_info_2 = JSON.parse(Info_buffer).splice(viertel,arrayLength/4);
        var words_info_3 = JSON.parse(Info_buffer).splice(halb,halb/2);
        var words_info_4 = JSON.parse(Info_buffer).splice(dreiv,arrayLength);
        //------------------------------ 
        //console.log(viertel_f,words_info.length,arrayLength," - math floor length")         

        var i =0

        var dosome = setInterval(dosomeTimer, 1);  
        function dosomeTimer() 
        {
            if (i==0)
            {
                sm.sl_modul(ChatChannel,words_info_1,words_info_1.length,0,bot,1,message);
            }
            if (i==10)
            {
                sm.sl_modul(ChatChannel,words_info_2,words_info_2.length,viertel,bot,2,message);
            }
            if (i==20)
            {
                sm.sl_modul(ChatChannel,words_info_3,words_info_3.length,halb,bot,3,message);
            }
            if (i==30)
            {
                sm.sl_modul(ChatChannel,words_info_4,words_info_4.length,dreiv,bot,4,message)
                clearInterval(dosome),i=0;
            }
            i++;
        };
    });
};
//------------------------------
/**
* @param {Object} auth
* @param {Object} auth_id
* @param {Object} message
* @param {Object} bot
* @param {Object} comando
* @param {Object} slice
* @param {Object} ChatChannel
*/
exports.delete_song = function(auth,auth_id,message,bot,comando,slice,ChatChannel) {

    var url = [];
    var url_info = [];
  
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap(no_file_created));  
        }
        var i=0;
        var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput) 
        var info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)    
        var words_url = JSON.parse(url_buffer);
        var words_info = JSON.parse(info_buffer);
        var getNumber = message.content.slice(slice);

        words_url[0] = auth;
        words_info[0] = auth;
        if (message.content.startsWith(comando)) {
            var SongListVar = setInterval(SongListTimer, 1);  
            function SongListTimer() 
            {  
            
                url.push(words_url[i]);
                url_info.push(words_info[i]);
                if (i==words_url.length-1)
                { 
                    clearInterval(SongListVar),i=0;                    
                    var lead = url_info[getNumber];
                    if (getNumber==0){
                        url_info = []; 
                        url = [];
                        return bot.channels.find("name", ChatChannel).send('```\n' +delete_your_name+ '\n```');
                    }else{

                        url.splice(getNumber, 1); //löscht 1 gewünschte zeile aus der array
                        url_info.splice(getNumber, 1); //löscht 1 gewünschte zeile aus der array

                        fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                        {
                            fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                            {
                                if (err)
                                    throw err;
                                url_info = []; 
                                url = [];          
                                message.delete();
                                return bot.channels.find("name", ChatChannel).send('```\n'+getNumber+" : "+lead+'\n'+" >> "+song_delete+ '\n```');
                            });
                        });
                    };
                }
                i++     
            };    
        };
        return;
    });    
};
//---------------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
};
//---------------------------------------