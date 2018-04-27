const ytdl = require("ytdl-core");
const fs = require("fs");
const mpm = require("./music_play_modul");
//------------------------------
const Songlisten_pfad ='./songlisten/';
const urlInfo = '-url_info.json';
const urlInput = '-url_input.json';
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var smallSongList = setting.songList_25;
var bigSongList = setting.songList_50;
if (smallSongList=="true"){
    var y = 76
    bigSongList="false";}
if (bigSongList=="true"){
    var y = 39 
    smallSongList="false";}
//------------------------------------
/**
* @param {Object} auth_id
* @param {Object} message
* @param {Object} bot
* @param {Object} comando
* @param {Object} slice
* @param {Object} prefix
* @param {Object} ChatChannel
* @param {Object} memberchannel
*/
exports.get_song_at_list = function(auth_id,message,bot,comando,slice,prefix,ChatChannel,memberchannel,set_playsong) {

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap('Es wurde noch keine Liste angelegt'));  
        }        
        
        var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput);     
        var url = JSON.parse(url_buffer);

        var url_info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)     
        var url_info = JSON.parse(url_info_buffer);

        var songlength= url.length;
        var songlengthmsg = url.length-1;
        var getNumber = message.content.slice(slice);
        
        //console.log(songlength)        
        
        if(!memberchannel){
            return bot.channels.find("name", ChatChannel).send(wrap('Du musst erst ein Voice channel betreten'));
        }else if(getNumber.search(/^[^a-z]+/)){
            return bot.channels.find("name",ChatChannel).send(wrap("nur zahlen erlaubt 1 - "+songlength));   
        }else{ 

            if (getNumber==0){
                return bot.channels.find("name",ChatChannel).send(wrap("sorry das geht nicht")); 
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
                return bot.channels.find("name",ChatChannel).send(wrap("auserhalb der song list range"+" : "+"Max Song Länge - "+songlengthmsg)); 
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
*/
exports.getRandom = function(auth_id,message,bot,comando,prefix,ChatChannel,memberchannel,RandomColor,bot_MessChannel) {

    var url_mess = 0;
    
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap('Es wurde noch keine Liste angelegt'));  
        }
        else if (!memberchannel){
            return bot.channels.find("name", ChatChannel).send(wrap('Du musst erst ein Voice channel betreten'));
        }else if(message.content.startsWith(comando)) {
            
            var data  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput)     
            var words = JSON.parse(data)
            var url_mess = words[Math.floor(Math.random() * words.length)];
            memberchannel.join();
            mpm.play_song(memberchannel, message, RandomColor,bot_MessChannel,url_mess)
        };
    });
}
//---------------------------------------
/**
* @param {Object} auth
* @param {Object} auth_id
* @param {Object} message
* @param {Object} bot
* @param {Object} comando
* @param {Object} slice
* @param {Object} ChatChannel
*/
exports.savesong = function(auth,auth_id,message,bot,comando,slice,ChatChannel,msg){

    var url = [];
    var url_info = [];
    var url_input = [];

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            bot.channels.find("name", ChatChannel).send('```\n'+'file musste erst angelegt werden.'+'\n'+'bitte nochmal url eingeben'+'\n```');
            fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
            {
                if (err)
                    throw err;
            });        
            fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
            {
                if (err)
                    throw err;
            });
        } else {
            var i=0;
            var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput) 
            var url_info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)    
            var words_url = JSON.parse(url_buffer);
            var words_info = JSON.parse(url_info_buffer);

            var url_message = message.content.slice(slice);

            var maxBuffer = 2000;
            var bufferMath = maxBuffer/y;
            var mathSlice = 29; // 2000 / 50 song = 40 zeichen - 11 zeichen für song dauer = 29 

            var url_messageInfo = url_message;

            words_url[0] = auth;
            words_info[0] = auth;

            if (url_info_buffer.byteLength>maxBuffer){
                return bot.channels.find("name", ChatChannel).send('```\n' +"overload buffer zise"+" - Max Buffer "+maxBuffer+ '\n```');
            }
            if (url_message.indexOf("h")>0){
                return bot.channels.find("name", ChatChannel).send('```\n' +"zuviele leerzeichen"+ '\n```');
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
                                    return message.channel.send(wrap("Error unvollständige url")); // error unvollständige url
                                }
                                else {
                                    var time = videoInfo.length_seconds / 60; //viedeo Time  
                                    url_messageInfo = videoInfo.title.slice(0,mathSlice)+" : "+time.toFixed(1)+ " min";                                
                                    url_info.push(url_messageInfo);
                                    url.push(url_message);
                                    var bufferMathNachricht = bufferMath;
                                }    
                                if (url.length>bufferMath)
                                {
                                    url_info = []; 
                                    url = []; 
                                    message.delete();
                                    return bot.channels.find("name", ChatChannel).send('```\n'+auth+" Max Speicherplatz wurde erreicht.. es sind "+bufferMathNachricht.toFixed(0)+" speicherungen erlaubt"+ '\n```');         
                                }else{
                                    fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                                    {   
                                        if (err)
                                            throw err;
                                        fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                                        {
                                            if (err)
                                                throw err;
                                            message.delete();    
                                            url_info = []; 
                                            url = [];
                                            return bot.channels.find("name", ChatChannel).send('```\n' +url_messageInfo+'\n'+">> wurde zur Liste hinzu gefügt" + '\n```');
                                        });
                                    });
                                };                                
                            }); 
                        };
                        i++ 
                    };                
                }else{
                    message.delete();
                    return bot.channels.find("name", ChatChannel).send('```\n' +"Nur Youtube url`s erlaubt"+ '\n```');
                };  
            };
        };
    });    
};
//------------------------------
/**
* @param {Object} auth
* @param {Object} auth_id
* @param {Object} message
* @param {Object} bot
* @param {Object} ChatChannel
*/
exports.songliste = function(auth,auth_id,message,bot,ChatChannel){

    var i=0; 

    var url = [];
    var url_info = [];
    var url_input = [];
    var url_info_1 = []  
    var url_info_2 = []
    var url_input_1 = []  
    var url_input_2 = []

    fs.exists(Songlisten_pfad+auth_id+urlInfo,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap('Es wurde noch keine Liste angelegt'));  
        }

        var Info_buffer = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo);
        var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput);

        if (bigSongList=="true"){

            var words_info = JSON.parse(Info_buffer);
            var arrayLength = words_info.length+1;
            var fixedArrayLength = Math.ceil(arrayLength);
            var MidWert = Math.ceil(fixedArrayLength/2-1);
            var words_info1 = JSON.parse(Info_buffer).splice(0,MidWert+1);
            var words_info2 = JSON.parse(Info_buffer).splice(MidWert,fixedArrayLength);
            console.log(MidWert)
            var SongListVar = setInterval(SongListTimer, 5);  
            function SongListTimer() 
            {                         
                url_info_1.push(words_info1[i]);                

                if (i==MidWert)
                {            
                    clearInterval(SongListVar),i=0;

                    var SongListVar2 = setInterval(SongListTimer2, 5);                   
                    function SongListTimer2() 
                    { 
                           
                        url_info_2.push(words_info2[i]);

                        if (i==fixedArrayLength-MidWert-2)
                        {
                            clearInterval(SongListVar2),i=0;

                            urlListe1 = url_info_1.map((url_info_1, z) => (z + 0) + ' : ' + url_info_1).join('\n');
                            urlListe2 = url_info_2.map((url_info_2, z) => (z + MidWert+1) + ' : ' + url_info_2).join('\n');
                    
                            url_input_1.push(urlListe1)
                            url_input_2.push(urlListe2)
                            
                            bot.channels.find("name", ChatChannel).send('```\n' + url_input_1 + '\n```')
                            bot.channels.find("name", ChatChannel).send('```\n' + url_input_2 + '\n```')

                            url_input_1=[]; 
                            url_input_2=[]; 
                            url_info_1 = [];
                            url_info_2 = [];  
                            return;
                        };    
                        i++
                    };   
                };  
                i++
            };
        }
        
        if (smallSongList=="true"){
            
            var words_info = JSON.parse(Info_buffer);
            var words_url = JSON.parse(url_buffer);

            var arrayLength_info = words_info.length;
            var arrayLength_url = words_url.length;   

            var SongListVar = setInterval(SongListTimer, 1);  
            function SongListTimer() 
            {                         
                url.push(words_url[i]);
                url_info.push(words_info[i]);

                
                if (i==words_info.length-1)
                {
                    clearInterval(SongListVar),i=0;
                                    
                    if (arrayLength_url>26){

                        url.splice(26, arrayLength_url);
                        url_info.splice(26, arrayLength_info);                   
   
                        fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                        {
                            fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                            {
                                if (err)
                                    throw err;

                                urlListe = url_info.map((url_info, z) => (z + 0) + ' : ' + url_info).join('\n');
                                url_input.push(urlListe)
                                bot.channels.find("name", ChatChannel).send('```\n' + url_input + '\n```')

                                url_input = [];
                                url_info = []; 
                                url = [];                                
          
                                return bot.channels.find("name", ChatChannel).send('```\n' +"Songliste wurde bis auf 25 Songs gelöscht"+ '\n```');
                            });
                        }); 
                    }else{
                        urlListe = url_info.map((url_info, z) => (z + 0) + ' : ' + url_info).join('\n');
                        url_input.push(urlListe)
                        bot.channels.find("name", ChatChannel).send('```\n' + url_input + '\n```')

                        url_input = [];
                        url_info = [];
                        url = []; 
                        return;
                    }                           
                };
                i++
            };
        }       
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
exports.deletesong = function(auth,auth_id,message,bot,comando,slice,ChatChannel) {

    var url = [];
    var url_info = [];
  
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap('Es wurde noch keine Liste angelegt'));  
        }
        var i=0;
        var url_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput) 
        var info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)    
        var words_url = JSON.parse(url_buffer);
        var words_info = JSON.parse(info_buffer);
        var getNumber = message.content.slice(slice);

        console.log(comando)

        words_url[0] = auth;
        words_info[0] = auth;
        //console.log(getNumber);
        if (message.content.startsWith(comando)) {
            var SongListVar = setInterval(SongListTimer, 1);  
            function SongListTimer() 
            {  
            
                url.push(words_url[i]);
                url_info.push(words_info[i]);
                //console.log(url);
                if (i==words_url.length-1)
                { 
                    clearInterval(SongListVar),i=0;                    
                    var lead = url_info[getNumber];
                    if (getNumber==0){
                        url_info = []; 
                        url = [];
                        return bot.channels.find("name", ChatChannel).send('```\n' +"du kannst nicht deinen Namen löschen"+ '\n```');
                    }else{

                        url.splice(getNumber, 1); //löscht 1 gewünschte zeile aus der array
                        url_info.splice(getNumber, 1); //löscht 1 gewünschte zeile aus der array

                        //console.log(url_info);
                        fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url, null, 4), err => 
                        {
                            fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                            {
                                if (err)
                                    throw err;
                                url_info = []; 
                                url = [];          
                                message.delete();
                                return bot.channels.find("name", ChatChannel).send('```\n'+getNumber+" : "+lead+'\n'+" >> wurde gelöscht" + '\n```');
                            });
                        });
                    }
                }
                i++     
            }    
        };
        return;
    });    
}
//---------------------------------------
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
};
//---------------------------------------