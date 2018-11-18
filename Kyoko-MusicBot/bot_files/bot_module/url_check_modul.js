const ytdl = require("ytdl-core"),
    mpm = require('./music_play_modul')


var queue_url_array = mpm.queue_url_array,
    current_queue_songtitel = mpm.current_queue_songtitel,
    queue_titel_array = mpm.queue_titel_array

module.exports={ 
    
    url_check: url_check  = function (queue_url_array,current_queue_songtitel,queue_titel_array,bot_MessChannel,url_error){
        url_error=false
        ytdl.getInfo(queue_url_array, (err, info) => { 
            if (err){
                url_error=true                       
                return bot_MessChannel.send(carefully("[*]( error! - check the url )" + '\n' +"<   "+queue_url_array+"   >"))                
            }else{
                url_error=false
            } 
        })
        return url_error
    }
}
//------------------------------
function carefully(text) {
    return '```md\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//-------------------------------  