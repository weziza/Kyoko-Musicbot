const discord = require('discord.js');
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
//------------------------------
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
const index = require("../index");
var bot = index.bot; //import var bot aus script index.js
//------------------------------
var dosome = false;
//------------------------------
/**
* @param {Object} MessChannel // the message.channel
* @param {Object} InfoSetImage // setImage Datenbank.json Math random
* @param {Object} InfoThumbnail // setThumbnail Datenbank.json Math random
* @param {Object} prefix // prefix 
* @param {Object} color // Math Color
* @param {Object} MaxQueue // Max Lead Nummer
*/
exports.InfoScreen = (set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_mega,set_ping,MessChannel,prefix,RandomColor,MaxQueue,BotName) => {
  var embed = new discord.RichEmbed()
      .setTitle("《 "+ help_text_heading+" - "+ BotName + " 》" )
      .setAuthor(BotName +"〔 (∩｀-´)⊃━━☆･•.*･•*.♫♪℘❧ 〕", bot_author_Image)
      .setDescription("[ command`s ]")
      .setColor(RandomColor)
      .addField("-----------------------------",'```Markdown'+'\n< ' + prefix + set_hilfe+" | "+prefix+set_mega+" | "+prefix+set_ping+" | "+prefix+set_uhr+ ' >'+'\n'+'< '+prefix+"admin" + ' >```', true)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_purge+' | '+'Löscht 100 Zeilen im Channel. ' + '```',false)       
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_queue+' | '+'Zeige Song`s in der Warteschlange. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_skip+' | '+'Überspringt das spielende Lied. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_clean+' | '+'Leert die Warteschlange. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_pause+' | '+'Musik pausiert. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_resume+' | '+'Musik fort­set­zen. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_leave+' | '+'Bot leave Voice Channel. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_volume+' | '+'[ zahl ] Volume 0 bis 10 Max. ' + '```',false)        
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_playsong+' | '+'[ url ] : Füge ein Youtube Link hinzu ' + '```',false)
      .addField("----------> oder <-----------",'```Nginx'+'\n' + prefix + set_playsong+' | '+'[ Nr ] Spiel einen Song aus meiner Liste. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_randomsong+' | '+'Spiel ein zufälligen Song aus meiner Liste. ' + '```',false) 
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_searchsong+' | '+'[ ??? ] : Suche in Youtube ' + '```',false)      
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_songliste+' | '+'Zeige meine Songliste. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_savesong+' | '+' Max '+ GrList +' Song`s in deiner Liste. ' + '```',false)
      .addField("-----------------------------",'```Nginx'+'\n' + prefix + set_deletesong+' | '+'[ Nr ] lösch ein Song aus meiner Liste. ' + '```',false)
      .addField("-----------------------------",'```Ini'+'\n' + 'größe der Warteschlange = '+'[ '+MaxQueue+' ]' + '```',false)
      .setThumbnail(setThumbnail[Math.floor(Math.random()* setThumbnail.length)])
      .setImage(setImage[Math.floor(Math.random()* setImage.length)])
      .setTimestamp()
      .setFooter(BotName, "https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png");
  MessChannel.send(embed);
  return embed;
};
//-----------------------------
/**
* @param {Object} InfoText1 // Info Text zeile 1
* @param {Object} InfoText2 // Info Text zeile 2
* @param {Object} MessChannel // the message.channel
* @param {Object} RandomColor // Math color
* @param {Object} BotName // Bot Name
* @param {Object} Thumbimage // Thumb Image
*/
exports.ambedMessage = (InfoText1,InfoText2,MessChannel,RandomColor,BotName,Thumbimage) => {
  var embed = new discord.RichEmbed()
    .setAuthor("〔"+BotName + "™ 〕", bot_author_Image)
    .addField(InfoText1,InfoText2,  false )
    .setThumbnail(Thumbimage)
    .setColor(RandomColor)
    .setTimestamp()
    .setFooter(BotName, "https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png");
    MessChannel.send(embed);
};
//-----------------------------
/**
* @param {Object} InfoText1 // Info Text zeile 1
* @param {Object} InfoText2 // Info Text zeile 2
* @param {Object} MessChannel // the message.channel
* @param {Object} RandomColor // Math color
* @param {Object} BotName // Bot Name
* @param {Object} Thumbimage // Thumb Image
* @param {Object} message // Thumb Image
*/
exports.play_ambedMessage = (InfoText1,InfoText2,MessChannel,RandomColor,BotName,Thumbimage,message,sendEmojiTime) => {

    MessChannel.bulkDelete(100);

    var embed = new discord.RichEmbed()
    .setAuthor("〔"+BotName + "™ 〕", bot_author_Image)
    .addField(InfoText1,InfoText2, false )
    .addField("Info:",'```HTTP'+'\n'+`Emoji Bar send in:`+'\n'+'----| '+ sendEmojiTime/1000 +`.sec`+' |----'+'```', false )
    .setThumbnail(Thumbimage)
    .setColor(RandomColor)
    .setTimestamp()
    .setFooter(BotName, "https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png")
    MessChannel.send(embed);
    if(!dosome){
        dosome=true;
        run(MessChannel,message,sendEmojiTime);
    };
};
//-----------------------------
/**
* @param {Object} InfoText1 // Info Text zeile 1
* @param {Object} InfoText2 // Info Text zeile 2
* @param {Object} MessChannel // the message.channel
* @param {Object} RandomColor // Math color
* @param {Object} BotName // Bot Name
* @param {Object} Thumbimage // Thumb Image
*/
exports.pause_ambedMessage = (InfoText1,InfoText2, MessChannel,RandomColor,BotName,Thumbimage) => {
    var embed = new discord.RichEmbed()
    .setAuthor("〔"+BotName + "™ 〕", bot_author_Image)
    .addField(InfoText1,InfoText2, false )
    .setThumbnail(Thumbimage)
    .setColor(RandomColor)
    .setTimestamp()
    .setFooter(BotName, "https://appstipsandtricks.com/wp-content/uploads/2016/11/snapchat-blue-screenshot.png");
    MessChannel.send(embed).then(function (message) {
        message.react(playEmoji);  
    }).catch(function(error){
        //console.log(error);
        return;
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
        MessChannel.send(embed);
    return embed;
};
//-----------------------------
async function run(MessChannel,message,sendEmojiTime){
 
    await MessChannel.awaitMessages(msg => msg.content.includes("play"),{time: sendEmojiTime});
    MessChannel.send(`Emoji Bar!`)
    .then(async function(message){
        dosome=false
        await message.react(pauseEmoji);
        await message.react(playEmoji);
        await message.react(skipEmoji);
        await message.react(cleanEmoji);
        await message.react(kickEmoji);
        await message.react(volumeupEmoji);
        await message.react(volumedownEmoji);  
    }).catch(function(error){
        //console.log(error);
        console.log(`Fehler beim laden der Emoji Bar!`+`\n`+`DiscordAPIError`+`\n`+`message: Unknown Message`);
        return;
    });          
};
//-----------------------------
