const discord = require('discord.js');
const ytdl = require("ytdl-core");
var fs = require("fs");
//------------------------------
var url_text = [];
var url_info = [];
var url_info_2 = [];
var url_input = [];
//------------------------------
const Songlisten_pfad='./bot_module/songlist/';
const urlInfo = '-url_info.json';
const urlInput = '-url_input.json';
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
*/
exports.getsong = function(auth_id,message,bot,comando,slice,prefix,ChatChannel,memberchannel,set_playsong) {


    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap('Es wurde noch keine Liste angelegt'));  
        }        
        
        var data  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput)     
        var words = JSON.parse(data)
        var songlength= words.length;
        var getNumber = message.content.slice(slice);
        
        //console.log(data.byteLength)        
        
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
                            var mess = words[i];
                            //console.log(words[i])
                            memberchannel.join();
                            bot.channels.find("name", ChatChannel).send(prefix + set_playsong + " " +mess);
                        };
                        i ++
                    };                
                } 
            }else{
                return bot.channels.find("name",ChatChannel).send(wrap("auserhalb der song list range"+" : "+"Max Song Länge - "+songlength)); 
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
exports.getRandom = function(auth_id,message,bot,comando,prefix,ChatChannel,memberchannel,set_playsong) {

    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap('Es wurde noch keine Liste angelegt'));  
        }
        else if (!memberchannel){
            bot.channels.find("name", ChatChannel).send(wrap('Du musst erst ein Voice channel betreten'));
        }else if(message.content.startsWith(comando)) {
            
            var data  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput)     
            var words = JSON.parse(data)
            var mess = words[Math.floor(Math.random() * words.length)];
            memberchannel.join();
            bot.channels.find("name", ChatChannel).send(prefix + set_playsong + " " +mess);  
        }return;
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
    
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            bot.channels.find("name", ChatChannel).send('```\n'+'file musste erst angelegt werden.'+'\n'+'bitte nochmal url eingeben'+'\n```');
            fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url_text, null, 4), err => 
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
            var data  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput) 
            var data_info  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)    
            var words_url = JSON.parse(data);
            var words_info = JSON.parse(data_info);   
            var url_message = message.content.slice(slice);
            var maxBuffer=2000;
            var bufferMath = maxBuffer/39;
            var url_messageInfo = url_message;

            words_url[0] = auth;
            words_info[0] = auth;

            //console.log(auth+" | "+data.byteLength)

            if (data_info.byteLength>maxBuffer){
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
                        url_text.push(words_url[i]);
                        url_info.push(words_info[i]);

                        if (i==words_url.length-1)
                        {         
                            clearInterval(SongListVar),i=0;
                            
                            ytdl.getInfo(url_messageInfo, (error, videoInfo) => {
                                if (error) {
                                    return message.channel.send(wrap("Error unvollständige url")); // error unvollständige url
                                }
                                else {

                                    //console.log(videoInfo.keywords)
                                    
                                    var time = videoInfo.length_seconds / 60; //viedeo Time  
                                    url_messageInfo = videoInfo.title.slice(0,17)+" : "+time.toFixed(1)+ " min";                                
                                    url_info.push(url_messageInfo);
                                    url_text.push(url_message)              
                                    //console.log(videoInfo)
                                    var bufferMathNachricht = maxBuffer/40;
                                }    
                                if (url_text.length>bufferMath.toFixed(0))
                                {
                                    url_info = []; 
                                    url_text = []; 
                                    message.delete();

                                    return bot.channels.find("name", ChatChannel).send('```\n'+auth+" momentan sind nur "+bufferMathNachricht.toFixed(0)+" speicherungen erlaubt"+ '\n```');         
                                }else{
                                    fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url_text, null, 4), err => 
                                    {   
                                        if (err)
                                            throw err;
                                        fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                                        {
                                            if (err)
                                                throw err;
                                            url_info = []; 
                                            url_text = [];          
                                            message.delete();
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


    fs.exists(Songlisten_pfad+auth_id+urlInfo,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap('Es wurde noch keine Liste angelegt'));  
        }

        var i=0;
        var Info_buffer  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo);
        //console.log(Info_buffer.byteLength);
        var url_info = JSON.parse(Info_buffer);           

        url_info[0] = auth;

        var SongListVar = setInterval(SongListTimer, 1);  
        function SongListTimer() 
        {             
            url_text.push(url_info[i]);

            
            if (i==url_info.length-1)
            {

                clearInterval(SongListVar),i=0;                                    
                nerv = url_text.map((url_text, z) => (z-1+ 1) + ' : ' + url_text).join('\n');
                url_input.push(nerv)
                //console.log(nerv)
                bot.channels.find("name", ChatChannel).send('```\n' + url_input + '\n```')
                url_input=[];  
                url_text = [];   
                return;                              
            };
            i++
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
exports.deletesong = function(auth,auth_id,message,bot,comando,slice,ChatChannel) {
  
    fs.exists(Songlisten_pfad+auth_id+urlInput,(exists)=> {
        if (!exists) {
            message.delete();
            return bot.channels.find("name", ChatChannel).send(wrap('Es wurde noch keine Liste angelegt'));  
        }


        var i=0;

        var data  = fs.readFileSync(Songlisten_pfad+auth_id+urlInput) 
        var data_info  = fs.readFileSync(Songlisten_pfad+auth_id+urlInfo)    
        var words = JSON.parse(data);
        var words_info = JSON.parse(data_info);
        var getNumber = message.content.slice(slice);

        console.log(comando)

        words[0] = auth;
        //console.log(getNumber);
        if (message.content.startsWith(comando)) {
            var SongListVar = setInterval(SongListTimer, 1);  
            function SongListTimer() 
            {  
            
                url_text.push(words[i]);
                url_info.push(words_info[i]);
                //console.log(url_text);
                if (i==words.length-1)
                { 
                    clearInterval(SongListVar),i=0;

                    var lead = url_info[getNumber];
                    if (getNumber==0){
                        return bot.channels.find("name", ChatChannel).send('```\n' +"du kannst nicht deinen Namen löschen"+ '\n```');
                    }else{

                        url_text.splice(getNumber, 1); //löscht 1 gewünschte zeile aus der array
                        url_info.splice(getNumber, 1); //löscht 1 gewünschte zeile aus der array


                        //console.log(url_info);
                        fs.writeFile(Songlisten_pfad+auth_id+urlInput,JSON.stringify(url_text, null, 4), err => 
                        {
                            fs.writeFile(Songlisten_pfad+auth_id+urlInfo,JSON.stringify(url_info, null, 4), err => 
                            {
                                if (err)
                                    throw err;
                                url_info = []; 
                                url_text = [];          
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