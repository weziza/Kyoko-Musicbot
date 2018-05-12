const fs = require("fs");
const bmess = require('./bot_message_modul');
//------------------------------
const setting = require('../bot_setting/bot_setting.json');
var botchannel = setting.botchannel;
//------------------------------
var text = "〘 Songliste ♫ 〙➣ Abschnitt: ";
//------------------------------
/**
* @param {Object} ChatChannel
* @param {Object} words_info
* @param {Object} words_info_length
* @param {Object} Liste_int
* @param {Object} bot
*/
exports.sl_modul = function(ChatChannel,words_info,words_info_length,Liste_int,bot,liste_Nr){

    var bot_MessChannel = bot.channels.find("name", botchannel);
    //-----------------------------
    var sub = 0.5+Math.random()*0.15-0.35+Math.random()*1.3;
    var RandomColor = '0x'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(sub,6);
    //-----------------------------
    var i = 0;
    
    var url_info = [];
    var url_input = [];

    var SongListVar = setInterval(SongListTimer, 1);  
    function SongListTimer() 
    {                         
        url_info.push(words_info[i]);
        //console.log(words_info)
        
        if (i==words_info_length-1)
        {
            clearInterval(SongListVar),i=0;
    
            urlListe = url_info.map((url_info, x) => (x + Liste_int) + ': ' + url_info).join('\n');
            url_input.push(urlListe)
            bmess.sl_ambedMessage(text + liste_Nr, '```HTTP'+'\n' + url_input + '\n```', bot_MessChannel, RandomColor); 
            
            url_info = [];
            url_input = [];

            return;
        };
        i++;
    };          
};
//------------------------------