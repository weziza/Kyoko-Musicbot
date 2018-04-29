const discord = require('discord.js');
//------------------------------------
const setting = require('../bot_setting/bot_setting.json');
var smallSongList = setting.songList_25;
var bigSongList = setting.songList_50;
if (smallSongList=="true"){
    var GrList = 25;
    bigSongList="false";};
if (bigSongList=="true"){
    var GrList = 50;
    smallSongList="false";};
//------------------------------------
/**
* @param {Object} MessChannel // the message.channel
* @param {Object} InfoSetImage // setImage Datenbank.json Math random
* @param {Object} InfoThumbnail // setThumbnail Datenbank.json Math random
* @param {Object} prefix // prefix 
* @param {Object} color // Math Color
* @param {Object} MaxQueue // Max Lead Nummer
*/
exports.InfoScreen = (set_playsong,set_searchsong,set_deletesong,set_savesong,set_songliste,set_randomsong,set_getsong,set_purge,set_volume,set_leave,set_resume,set_pause,set_skip,set_queue,set_clean,set_hilfe,set_uhr,set_witz,set_mega,set_ping,MessChannel,setImage,setThumbnail,prefix,RandomColor,MaxQueue) => {
  //console.log(MaxQueue)
  var embed = new discord.RichEmbed()
      .setTitle("( super duba hilfe, vom mega heftig Kyoko  )")
      .setAuthor("Kyoko ", "https://i.imgur.com/lm8s41J.png")
      .setDescription("[ command`s ]")
      .setColor(RandomColor)
      .addField("-----------------------------",prefix + set_hilfe+" | "+prefix+set_mega+" | "+prefix+set_ping, true)      
      .addField("-----------------------------",prefix + set_clean+' | '+'Leert die Warteschlange. ',false)
      .addField("-----------------------------",prefix + set_queue+' | '+'Zeige Tracks in der Warteschlange. ',false)
      .addField("-----------------------------",prefix + set_skip+' | '+'Überspringt das spielende Lied. ',false)
      .addField("-----------------------------",prefix + set_pause+' | '+'Musik pausiert. ',false)
      .addField("-----------------------------",prefix + set_resume+' | '+'Musik fort­set­zen. ',false)
      .addField("-----------------------------",prefix + set_leave+' | '+'schmeißt den Bot aus dem Voice Channel. ',false)
      .addField("-----------------------------",prefix + set_volume+' | '+'[ zahl ]  Lautstärke 0 bis 10 Max. ',false)
      .addField("-----------------------------",prefix + set_purge+' | '+'Löscht Maximal die letzten 100 Zeilen. ',false)     
      .addField("-----------------------------",prefix + set_getsong+' | '+'[ Nr ] Spiel genau den Song aus der Liste. ',false)
      .addField("-----------------------------",prefix + set_randomsong+' | '+'Spiel ein zufälligen Song aus der Liste. ',false)
      .addField("-----------------------------",prefix + set_playsong+' | '+'[ url ] : Füge ein Youtube Link hinzu ',false)
      .addField("-----------------------------",prefix + set_searchsong+' | '+'[ ??? ] : Suche Youtube Link ',false)      
      .addField("-----------------------------",prefix + set_songliste+' | '+'Zeige Songliste. ',false)
      .addField("-----------------------------",prefix + set_savesong+' | '+'Füge Max '+ GrList +' Song`s in deiner Liste hinzu. ',false)
      .addField("-----------------------------",prefix + set_deletesong+' | '+'[ Nr ] löscht ein Song aus deiner Liste. ',false)
      .addField("-----------------------------",' die Maximale '+' Anzahl der Warteschlange liegt bei '+'[ '+MaxQueue+' ]',false)
      .setThumbnail(setThumbnail[Math.floor(Math.random()* setThumbnail.length)])
      .setImage(setImage[Math.floor(Math.random()* setImage.length)])
      //.addBlankField(true)
      .setTimestamp()
      .setFooter("Kyoko ", "https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fsnapchat-download.net%2Fwp-content%2Fuploads%2F2015%2F10%2Fsnapchat-blue-double-arrow-icon-mean.png&f=1");
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
* @param {Object} Botimage // Bot Image
* @param {Object} Thumbimage // Thumb Image
*/
exports.ambedMessage = (InfoText1,InfoText2, MessChannel,RandomColor,BotName,Botimage,Thumbimage) => {
  var embed = new discord.RichEmbed()
      .setAuthor(BotName, Botimage)
      .addField(InfoText1,InfoText2, true)
      .setThumbnail(Thumbimage)
      .setColor(RandomColor)
      .setTimestamp()
      .setFooter("Kyoko ", "https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fsnapchat-download.net%2Fwp-content%2Fuploads%2F2015%2F10%2Fsnapchat-blue-double-arrow-icon-mean.png&f=1");
      MessChannel.send(embed);
  return embed;
};
//-----------------------------