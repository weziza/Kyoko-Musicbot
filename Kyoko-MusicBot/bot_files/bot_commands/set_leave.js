const sgm = require('../bot_module/music_play_modul')
const bmc = require('../bot_module/bot_must_check.js')
//-----------------------------
const setting = require('../bot_setting/bot_setting.json')
var botchannel = setting.botchannel
//-----------------------------
const commands_setting = require('../bot_setting/commands_setting.json')
var set_leave = commands_setting.set_leave
var msz = 0
//-----------------------------
exports.run = async (bot,message)=>{    
    //-----------------------------
    if(!bmc.user_in_voicechannel()){}else{return}
    if(!bmc.check_it_play()){}else{return}  
    //-----------------------------
    message.channel.fetchMessages({ limit: 100 }).then(messages => {            
        msz = messages.size+1
    })
    var bot_MessChannel = bot.channels.find(channel => channel.name === botchannel) // bot schreibt in einen bestimmten angegebenen channel
    // setTimeout(function(){
    //     // console.log("hallo  bulkDelete   on end")  
    //     bot_MessChannel.bulkDelete(msz)
    // },10000) 
    //------------------------------
    sgm.leave(bot_MessChannel,message)    
}

exports.help = {
    name: set_leave
}