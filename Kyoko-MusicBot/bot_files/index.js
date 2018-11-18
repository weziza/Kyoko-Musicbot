const discord = require('discord.js')
const fs = require('fs')
const bmc = require('./bot_module/bot_must_check.js')
const mpm = require('./bot_module/music_play_modul')
//------------------------------
const bot = new discord.Client()
//------------------------------
const playerEmoji = require('./bot_setting/emoji_setting')
var playEmoji = playerEmoji.playEmoji,
    pauseEmoji = playerEmoji.pauseEmoji,
    skipEmoji = playerEmoji.skipEmoji,
    kickEmoji = playerEmoji.kickEmoji,
    volumeupEmoji = playerEmoji.volumeupEmoji,
    volumedownEmoji = playerEmoji.volumedownEmoji,
    cleanEmoji = playerEmoji.cleanEmoji,
    replayEmoji = playerEmoji.replayEmoji
//------------------------------
const setting = require('./bot_setting/bot_setting.json')
var token = setting.token
    botchannel = setting.botchannel,
    bot_category = setting.bot_category,
    prefix = setting.prefix,
    bot_name = setting.bot_name,
    message_size_delete = setting.message_size_delete,
    debugBot = setting.debugBot
//------------------------------
const commands_setting = require('./bot_setting/commands_setting.json')
var set_hilfe = commands_setting.set_hilfe,
    set_clean = commands_setting.set_clean,
    set_skip = commands_setting.set_skip,
    set_volume = commands_setting.set_volume,
    set_pause = commands_setting.set_pause,
    set_resume = commands_setting.set_resume,
    set_leave = commands_setting.set_leave,
    set_purge = commands_setting.set_purge,
    set_savesong = commands_setting.set_savesong,
    set_deletesong = commands_setting.set_deletesong,
    set_replay = commands_setting.set_replay
//------------------------------
var language = setting.language
//------------------------------
const lg = require('./language/language - '+language+'.json')
var pls_write_in_botchannel = lg.pls_write_in_botchannel,
    purge_size_max_message = lg.purge_size_max_message,
    purge_size_min_message = lg.purge_size_min_message
//------------------------------
var VolumeNr=1,
    autodelete=false,
    purge_size = false,
    //------
    room = bot.channels.find(channel => channel.name === bot_category),
    btc = bot.channels.find(channel => channel.name === botchannel),
    bot_command

    
//------------------------------
bot.commands = new discord.Collection()
fs.readdir("./bot_commands/",(err, files)=>{
    if(err)console.error(err)
    let jsfiles = files.filter(f => f.split(".").pop()==="js")
    // read the comman folder and initial the commands in a array
    // parameter files array = filder commands, split der the files and remove the last element
    if(jsfiles.length <= 0){
        console.log("no commands to load")
        return
    }

    console.log(`loading ${jsfiles.length} commands!`)
    //howe many command files in there
    jsfiles.forEach((f,i)=>{
        let props = require(`./bot_commands/${f}`)
        console.log(`${i+1} : ${f} loaded!`)
        //give the files array a number to listen
        bot.commands.set(props.help.name,props)
    })
})
//------------------------------
bot.on('ready', () => {      
    if (bot.channels.find(channel => channel.name === botchannel) == null) {
        return console.log(" <-------> " + "\n" + "cant find the channel " + botchannel + "\n" + " <-------> ")
        // startet der bot und fibdet den bot channel nicht dann return sonst bekommt der bot ein error.
    }
    else {
        var channel = bot.channels.find(channel => channel.name === botchannel)
        
        channel.send("im ready")
        bot.user.setActivity("-->  " + prefix + set_hilfe + "  <--")
        console.log("" +
            "\n" +
            `[Start] ${new Date()}`, " ----> ready" +
            "\n" +
            "" +
            "\n" +
            "                               Written by H5Pro2       " +
            "\n" +
            "                           https://github.com/H5Pro2" +
            "\n" +
            "<<-------------------------------------------------------------------------->> break line")
    }
}) 
//------------------------------
bot.on('messageReactionAdd', (reaction, user) => {    

    var pause = bot.commands.get(set_pause),
        skip = bot.commands.get(set_skip),
        clean = bot.commands.get(set_clean),
        replay = bot.commands.get(set_replay),
        resume = bot.commands.get(set_resume),
        kick = bot.commands.get(set_leave),
        volume = bot.commands.get(set_volume)

        // console.log(mpm.temp.bot_playing)
    
    if(!mpm.temp.bot_playing){return}else{
        
        if(reaction.emoji.id == pauseEmoji){
            if(user.username==bot_name){
                return
            }else{
                reaction.remove(user.id)            
                pause.run(bot,reaction.message)
            }
        }
        if(reaction.emoji.id === playEmoji) {
            if(user.username==bot_name){
                return
            }else{
                reaction.remove(user.id)            
                resume.run(bot,reaction.message)
            }
        }
        if(reaction.emoji.id === replayEmoji) {
            if(user.username==bot_name){
                return
            }else{
                reaction.remove(user.id)           
                replay.run(bot,reaction.message)
            }
        }
        if(reaction.emoji.id === cleanEmoji) {
            if(user.username==bot_name){
                return
            }else{
                reaction.remove(user.id)            
                clean.run(bot,reaction.message)
            }
        }
        if(reaction.emoji.id === skipEmoji) {
            if(user.username==bot_name){
                return
            }else{
                reaction.remove(user.id)            
                skip.run(bot,reaction.message)
            }
        }
        if(reaction.emoji.id === kickEmoji) {
            if(user.username==bot_name){
                return
            }else{
                reaction.remove(user.id)            
                kick.run(bot,reaction.message)
            }
        }
        if(reaction.emoji.id === volumeupEmoji) {
            if(user.username==bot_name){
                return
            }else{
                if(VolumeNr>9){
                    VolumeNr = 10
                    volume.run(bot,reaction.message,VolumeNr)
                    return reaction.remove(user.id)
                }else{                
                    VolumeNr++               
                    volume.run(bot,reaction.message,VolumeNr) 
                    return reaction.remove(user.id) 
                }
            }
        }    
        if(reaction.emoji.id === volumedownEmoji) {
            if(user.username==bot_name){
                return
            }else{
                if(VolumeNr<2){
                    VolumeNr = 1
                    volume.run(bot,reaction.message,VolumeNr)
                    return reaction.remove(user.id)
                }else{
                    VolumeNr--           
                    volume.run(bot,reaction.message,VolumeNr)
                    return reaction.remove(user.id)      
                }
            }
        }  
    }     
})
//------------------------------ 
bot.on("message",function(message){ 
    
    module.exports.temp={message:message,bot:bot}
    
    //-----------------------------
    let messageArray = message.content.split(/\s+/g) // im channel wurde geschrieben ???
    // let command = messageArray[0]
    let cmd = bot.commands.get(messageArray[0].slice(prefix.length)) 
    // vergleiche den befehl in der messageArray ob dieser in den commands vorhanden ist. 
    let bot_MessChannel = bot.channels.find(channel => channel.name === botchannel)             
    // bot schreibt in einen bestimmten angegebenen channel   
    //-----------------------------
    if(message.content==prefix+"install"){return cmd.run(bot,message)}
    // if (bot.channels.find(channel => channel.name === botchannel) == null){
    bmc.no_botchannel(message,bot)    
    if(bmc.temp.no==true){
        return
        // läuft der bot und man löscht den channel dann return sonst bekommt der bot ein error.
    }else{        
        //-----------------------------
        if(message.channel.name==undefined && message.content.startsWith(prefix+set_savesong+" https://www.youtube.com")){return cmd.run(bot,message) 
        }else if(message.channel.name==undefined && message.content.startsWith(prefix+set_deletesong)){return cmd.run(bot,message) 
        }else{            
            if (message_size_delete>100 && purge_size == false){purge_size = true
                return bot_MessChannel.send(carefully(purge_size_max_message))
                // verhindert ein error sollte bulkdelete über 100 liegen.
            }else if(message_size_delete<10 && purge_size == false){ purge_size = true
                return bot_MessChannel.send(carefully(purge_size_min_message))
                // sollte delete unter 10 liegen return.
            }else if (purge_size == true){        
                return purge_size = false
                /*  sollte eines von beiden zutreffen und purge_size wurde schon true gesetzt, 
                    dann geh auf false um die abfrage von vorne zu starten. */
            }else{                
                if(!message.content.startsWith(prefix)){                   
                    if(message.channel == bot_MessChannel){return autodelete_function(message,bot_MessChannel)}else{return}                
                    // message beginnt mit prefix dann / wenn nicht return und delete all gesendeten messages.
                }else{
                    bmc.run(message,bot) // sende bot_must_check die message und bot informationen erst wenn prefix benutzt wird
                    if(message.channel == bot_MessChannel){autodelete_function(message,bot_MessChannel)}
                    // sollten zu viele messages im chat stehen wie in der setting angegeben dann mach autodelete
                    if (bmc.write_bot_MessChannel()){ // ist bot channel ja/nein ??                     
                    }else{         
                        //-----------------------------  
                        if (message.content.startsWith(prefix+set_volume)){VolumeNr = message.content.replace(/^[^0-9]+/,'') }
                        // gib mir die zahl des befehls aus
                        //-----------------------------
                        if(!cmd){ // ist cmd nicht dann                 
                            return bot_MessChannel.send(wrap("invalid command"))//wenn der command nach dem prefix falsch geschrieben wurde 
                        }else{ // ist cmd ja dann  
                            setTimeout(function(){return cmd.run(bot,message,VolumeNr)}, 250)                
                        }
                    }
                }
            }
        }
    }    
})
//------------------------------
function autodelete_function(message,bot_MessChannel) {    

    message.channel.fetchMessages({ limit: 100 }).then(messages => {                

        if(messages.size > message_size_delete && autodelete==false){
            setTimeout(function () { 
                inst = bot.commands.get("install")
                inst.run(bot,message)
                return
            }, 1000)                     
        }
        if(messages.size == message_size_delete) {
            let purge = bot.commands.get(set_purge)
            return purge.run(bot,message.channel)
        }
    }) 
}
//------------------------------
function wrap(text) {
    return '```http\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------
function carefully(text) {
    return '```css\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```'
}
//------------------------------
bot.on("error",function(error){
    console.log(error.message)
})
//------------------------------
bot.on("debug",function(debug){
    if(debugBot==true){
    console.log(debug)}
})
//------------------------------
bot.on("voiceStateUpdate",function(oldMember,newMember){  
    
    if(oldMember.user.bot){
        // console.log("bot")
        VolumeNr=1 //reset the volume on voice connect or leave
    }
})
//------------------------------
bot.once('guildMemberAdd', member => {
    console.log(member.user.username)
})
//------------------------------
bot.login(token) // bot token
//------------------------------