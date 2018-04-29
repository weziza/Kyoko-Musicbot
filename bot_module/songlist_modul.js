const fs = require("fs");
//------------------------------
/**
* @param {Object} ChatChannel
* @param {Object} words_info
* @param {Object} words_info_length
* @param {Object} Liste_int
* @param {Object} bot
*/
exports.modul = function(ChatChannel,words_info,words_info_length,Liste_int,bot){

    //console.log(words_info_length)
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
    
            urlListe = url_info.map((url_info, x) => (x + Liste_int) + ' : ' + url_info).join('\n');
            url_input.push(urlListe)
            bot.channels.find("name", ChatChannel).send('```\n' + url_input + '\n```') 
            
            url_info = [];
            url_input = [];
        };
        i++;
    };          
};
//------------------------------