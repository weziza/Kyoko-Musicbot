const discord = require('discord.js');
const mpm = require('./music_play_modul.js');
//---------------------------------------
const playerEmoji = require('../bot_setting/emoji_setting');
var playEmoji = playerEmoji.playEmoji;
var pauseEmoji = playerEmoji.pauseEmoji;
var skipEmoji = playerEmoji.skipEmoji;
var kickEmoji = playerEmoji.kickEmoji;
var volumeupEmoji = playerEmoji.volumeupEmoji;
var volumedownEmoji = playerEmoji.volumedownEmoji;
var cleanEmoji = playerEmoji.cleanEmoji;
//------------------------------
const BotImages = require('../bot_images/botAuthor');
const bot_author_Image = BotImages.bot_author_Image;
const setThumbnail = require('../bot_images/InfoEmbedThumbnail');
const setImage = require('../bot_images/InfoEmbedImage');
//------------------------------
const description = require('../bot_setting/description.json');
var help_text_heading = description.help_text_heading;
var purge = description.purge;
var show_queue = description.show_queue;
var skip = description.skip;
var clean = description.clean;
var pause = description.pause;
var resume = description.resume;
var leave = description.leave;
var volume = description.volume;
var playsong_url = description.playsong_url;
var playsong_nr = description.playsong_nr;
var randomsong = description.randomsong;
var searchsong = description.searchsong;
var songliste = description.songliste;
var savesong = description.savesong;
var savedelete = description.savedelete;
var size_of_the_queue = description.size_of_the_queue;
//----------------------------
const setting = require('../bot_setting/bot_setting.json');
var prefix = setting.prefix;
var smallSongList = setting.songList_25;
var bigSongList = setting.songList_50;
if (smallSongList=="true"){
    var GrList = 25;
    bigSongList="false";};
if (bigSongList=="true"){
    var GrList = 50;
    smallSongList="false";};
//------------------------------
const commands_setting = require('../bot_setting/commands_setting.json');
var set_playsong = commands_setting.set_playsong;
//------------------------------
const index = require("../index.js");
var bot = index.bot; //import var bot aus script index.js
//------------------------------
var Emoji_Array = [];
var emoji_generade = false;
//------------------------------
var emoji_send = false
//------------------------------
var Text1 = [];
var Text2 = [];
var dothis = false;
//------------------------------
/**
* @param {Object} MessChannel // the message.channel
* @param {Object} InfoSetImage // setImage Datenbank.json Math random
* @param {Object} InfoThumbnail // setThumbnail Datenbank.json Math random
* @param {Object} prefix // prefix 
* @param {Object} color // Math Color
* @param {Object} max_queue // Max Lead Nummer
*/
exports.InfoScreen = (set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_mega,set_ping,MessChannel,prefix,RandomColor,max_queue,bot_name) => {
  var embed = new discord.RichEmbed()
      .setTitle("《 "+ help_text_heading+" - "+ bot_name + " 》" )
      .setAuthor(bot_name +"〔 (∩｀-´)⊃━━☆･•.*･•*.♫♪℘❧ 〕", bot_author_Image)
      .setDescription("[ command`s ]")
      .setColor(RandomColor)
      .addField("-----------------------------",'```Markdown'+'\n< ' + prefix + set_hilfe+" | "+prefix+set_mega+" | "+prefix+set_ping+" | "+prefix+set_uhr+ ' >'+'\n'+'< '+prefix+"admin" + ' >```', true)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_purge+' | '+purge + '```',false)       
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_queue+' | '+show_queue + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_skip+' | '+skip + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_clean+' | '+clean + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_pause+' | '+pause + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_resume+' | '+resume + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_leave+' | '+leave + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_volume+' | '+'[ Nr ] '+volume + '```',false)        
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_playsong+' | '+'[ url ] : '+playsong_url + '```',false)
      .addField("----------> oder <-----------",'```Nginx'+'\n' + prefix + set_playsong+' | '+'[ Nr ] '+playsong_nr + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_randomsong+' | '+randomsong + '```',false) 
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_searchsong+' | '+'[ ??? ] : '+searchsong + '```',false)      
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_songliste+' | '+songliste + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_savesong+' | '+'Max '+GrList+' - '+savesong + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_deletesong+' | '+'[ Nr ] '+savedelete + '```',false)
      .addField("-----------------------------",'```Ini'+'\n' + size_of_the_queue +' = '+'[ '+max_queue+' ]' + '```',false)
      .setThumbnail(setThumbnail[Math.floor(Math.random()* setThumbnail.length)])
      .setImage(setImage[Math.floor(Math.random()* setImage.length)])
      .setTimestamp()
      .setFooter(bot_name, "https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png");
    return MessChannel.send(embed);
};
//-----------------------------
/**
* @param {Object} InfoText1 // Info Text zeile 1
* @param {Object} InfoText2 // Info Text zeile 2
* @param {Object} MessChannel // the message.channel
* @param {Object} RandomColor // Math color
* @param {Object} bot_name // Bot Name
* @param {Object} Thumbimage // Thumb Image
*/
exports.ambedMessage = (InfoText1,InfoText2,MessChannel,RandomColor,bot_name,Thumbimage) => {
  var embed = new discord.RichEmbed()
    .setAuthor("〔"+bot_name + "™ 〕", bot_author_Image)
    .addField(InfoText1,InfoText2,  false )
    .setThumbnail(Thumbimage)
    .setColor(RandomColor)
    .setTimestamp()
    .setFooter(bot_name, "https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png");
    return MessChannel.send(embed);
};
//-----------------------------
/**
* @param {Object} InfoText1 // Info Text zeile 1
* @param {Object} InfoText2 // Info Text zeile 2
* @param {Object} MessChannel // the message.channel
* @param {Object} RandomColor // Math color
* @param {Object} bot_name // Bot Name
* @param {Object} Thumbimage // Thumb Image
*/
exports.pause_ambedMessage = (InfoText1,InfoText2, MessChannel,RandomColor,bot_name,Thumbimage) => {
    var embed = new discord.RichEmbed()
    .setAuthor("〔"+bot_name + "™ 〕", bot_author_Image)
    .addField(InfoText1,InfoText2, false )
    .setThumbnail(Thumbimage)
    .setColor(RandomColor)
    .setTimestamp()
    .setFooter(bot_name, "https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png");
    return MessChannel.send(embed).then(function (message) {
        message.react(playEmoji).catch(err => console.log(err)); 
    });
};
//-----------------------------
/**
* @param {Object} InfoText1 // Info Text zeile 1
* @param {Object} InfoText2 // Info Text zeile 2
* @param {Object} MessChannel // the message.channel
* @param {Object} RandomColor // Math color
*/
exports.sl_ambedMessage = (InfoText1,InfoText2, MessChannel,RandomColor) => {
    var embed = new discord.RichEmbed()
    .addField(InfoText1,InfoText2, true)
    .setColor(RandomColor)
    return MessChannel.send(embed);
};
//-----------------------------
/**
* @param {Object} InfoText1 // Info Text zeile 1
* @param {Object} InfoText2 // Info Text zeile 2
* @param {Object} MessChannel // the message.channel
* @param {Object} RandomColor // Math color
* @param {Object} bot_name // Bot Name
* @param {Object} Thumbimage // Thumb Image
* @param {Object} message // Thumb Image
*/

exports.play_ambedMessage = (InfoText1,InfoText2,MessChannel,RandomColor,bot_name,Thumbimage,message)=> {
   
    Text1=InfoText1
    Text2=InfoText2

    if(!dothis){
        dothis = true 

        var Emoji_tVar = setInterval(Emoji_Timer, 1);  
        var timer = Emoji_tVar._idleStart   
        function Emoji_Timer() 
        { 
            if(Emoji_tVar._idleStart>timer+2500){
                //console.log(Emoji_tVar._idleStart + "  timer clear")

                MessChannel.bulkDelete(10);

                clearInterval(Emoji_tVar), timer = 0 ,dothis = false 
                if(!emoji_send){
                    go(MessChannel,message,emoji_generade) 
                }
                var embed = new discord.RichEmbed()
                .setAuthor("〔"+bot_name + "™ 〕", bot_author_Image)
                .addField(Text1,Text2, false )
                .addField("Info:",'```HTTP'+'\n'+`Emoji Bar send in:`+'\n'+'----| '+ 5 +`.sec`+' |----'+'```', false )
                .setThumbnail(Thumbimage)
                .setColor(RandomColor)
                .setTimestamp()
                .setFooter(bot_name,"https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png")
                return MessChannel.send(embed);                
            };
        };         
    };
};
//-----------------------------
async function go(MessChannel,message,emoji_generade){ 

    var i = 0 
    emoji_send = true
    console.log(emoji_send) 

    await MessChannel.awaitMessages(msg => msg.content.includes(set_playsong),{
        time: 5000,
    }); 

    Emoji_Array.push(pauseEmoji);
    Emoji_Array.push(playEmoji);
    Emoji_Array.push(skipEmoji);
    Emoji_Array.push(cleanEmoji);
    Emoji_Array.push(kickEmoji);
    Emoji_Array.push(volumeupEmoji);
    Emoji_Array.push(volumedownEmoji);
    
    await MessChannel.send(`Emoji Bar!`)
    .then(function(message){        

        var Emoji_tVar = setInterval(Emoji_Timer, 500); 
        function Emoji_Timer(err)
        {          
            message.react(Emoji_Array[i]).catch((err) => {
                // console.log ("Timeout or other error: ", err)
                // catch the error if stop abruptly - ( unhandled promise rejections )
                return;
            });

            if(i==6){                               
                Emoji_Array=[]; 
                emoji_send = false             
                emoji_generade = false
                clearInterval(Emoji_tVar),i=0;
            };
            i++
        };       
    }).catch(err => console.log(err)); 
};

