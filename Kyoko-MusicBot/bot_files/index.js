const discord = require('discord.js')
const fs = require('fs')
const bmc = require('./bot_module/bot_must_check.js')
const mpm = require('./bot_module/music_play_modul')
const stp = require('./bot_commands/set_purge')
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
var purge_size_max_message = lg.purge_size_max_message,
    purge_size_min_message = lg.purge_size_min_message
//------------------------------
var VolumeNr=1,
    autodelete=false,
    purge_size = false,
    bot_command,
    max_message_size = 90
//------------------------------
bot.commands = new discord.Collection()
fs.readdir("./bot_commands/",(err, files)=>{
    if(err)console.error(err)

    let jsfiles = files.filter(f => f)         
        // let jsfiles = files.filter(f => f.split(".").pop()==="js")

    if(jsfiles.length <= 0){return console.log("no commands to load")}

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

    var channel = bot.channels.find(channel => channel.name === botchannel) 
    if(!channel){  
        console.log(bot.channels.map(channel=>channel.type+" | and Channel id: "+channel.id))
        if(bot.channels.find(channel=>channel.type === "text")){
            let channelfound = bot.channels.find(channel=>channel.type === "text")
            channelfound.send(" <-------> " + "\n" + "no channel found name " + botchannel + "  it will installed"+ "\n" + " <-------> ")
            return console.log(bot.channels.find(channel=>channel.type === "text") + "found")
        }
    }else{
        //------------------------------
        if(channel.name==botchannel){
            channel_id=true
            file = {botchannel_id: channel.id, file_is_writen: channel_id}
            fs.writeFile("./temp/bot_channel_id.json",JSON.stringify(file, null, 4), err =>{if (err){throw err}})               
        }else{console.log("no is not  "+channel.id,"   server start")}
        // write a json file for bot channel id information for funktions
        //------------------------------
        var channelsid = []
        x_channel = bot.channels.map(channel=>channel.name+" | and Channel type: "+channel.type+" | and Channel id: "+channel.id)
        x_channel.forEach((f,i)=>{channelsid.push(`${i+1}  Name: ${f}`)})
        fs.writeFile("./temp/all_channels_id.json",JSON.stringify({channels: channelsid}, null, 4), err =>{if (err){throw err}})
        // on bot start write all channels and id´s listet in a json file 

                        
        bot.user.setActivity("-->  " + prefix + set_hilfe + "  <--")
        pathandfilecheck()                                
        setTimeout(function(){ 
            channel.send("im ready")
        }, 1000) 
    }
}) 

function pathandfilecheck(){
    console.log("<<------------------------------->>")
    fs.exists("./bot_commands",(exists)=>{console.log(  "path bot_commands      exists:  " + exists)}),
    fs.exists("./bot_images",(exists)=>{console.log(    "path bot_images        exists:  " + exists)}),
    fs.exists("./bot_module",(exists)=>{console.log(    "path bot_module        exists:  " + exists)}),
    fs.exists("./bot_setting",(exists)=>{console.log(   "path bot_setting       exists:  " + exists)}),
    fs.exists("./bot_sounds",(exists)=>{console.log(    "path bot_sound         exists:  " + exists)}),
    fs.exists("./language",(exists)=>{console.log(      "path language          exists:  " + exists)}),
    fs.exists("./node_modules",(exists)=>{console.log(  "path node_module       exists:  " + exists)}),
    fs.exists("./temp",(exists)=>{console.log(          "path temp              exists:  " + exists)}),
    fs.exists("./user_songlist",(exists)=>{console.log( "path user_songlist     exists:  " + exists)}),
    setTimeout(function(){
        console.log("<<------------------------------->>")
        fs.exists("./package-lock.json",(exists)=>{console.log( "file package-lock.json     exists:  " + exists)}),
        fs.exists("./package.json",(exists)=>{console.log(      "file package.json          exists:  " + exists)}),
        fs.exists("./win_bot_run.exe",(exists)=>{console.log(   "file win_bot_run.exe       exists:  " + exists)}),
        fs.exists("./win_npm.exe",(exists)=>{console.log(       "file win_npm.exe           exists:  " + exists)}) 
    }, 100) 
    setTimeout(function(){ 
        console.log("<<------------------------------->>")
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
        ""+
        "\n" + 
        "<<-------------------------------------------------------------------------->> break line")
    }, 200) 
}
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

    // let lastmessage = message.channel.messages.map(msg=>msg.channel.messages.last())
    // let ldate = lastmessage.map(msg=>msg.channel.messages.last().createdAt)
    // let creatlastmessage = ldate[0].getDate()
    //-----------------------------
    x = fs.readFileSync("./temp/bot_channel_id.json"), err =>{if (err){throw err}}
    var fileback = JSON.parse(x) 
    // read the bot channel id information   
    //-----------------------------
    module.exports.temp={message:message,bot:bot} 
    //-----------------------------
    let messageArray = message.content.split(/\s+/g) // im channel wurde geschrieben ???
    // let command = messageArray[0]
    let cmd = bot.commands.get(messageArray[0].slice(prefix.length)) 
    // vergleiche den befehl in der messageArray ob dieser in den commands vorhanden ist. 
    let bot_MessChannel = bot.channels.find(channel => channel.name === botchannel)             
    // bot schreibt in einen bestimmten angegebenen channel   
    //-----------------------------

    if (!bot_MessChannel){
        // console.log("install  "+botchannel)
        inst = bot.commands.get("install")
        return inst.run(bot,message)
    }else if(!bot.channels.find(channel=>channel.name === bot_category)){
        // console.log("install   "+bot_category)
        inst = bot.commands.get("install")
        return inst.run(bot,message)
    }  
    
    if(message.content==prefix+"install"){return cmd.run(bot,message)}
    if(fileback.file_is_writen==true&&message.content.startsWith(prefix+set_savesong+" https://www.youtube.com")){return cmd.run(bot,message)} 
    if(fileback.file_is_writen==true&&message.content.startsWith(prefix+set_deletesong)){return cmd.run(bot,message)}
    // diese command müssen vor der no_botchannel abfrage und sind nur user accound seitig verwendbar
    //-----------------------------
    bmc.no_botchannel(message,bot)    
    if(bmc.temp.no==true){
        return
        //läuft der bot und man löscht den channel dann return sonst bekommt der bot ein error.
    }else{        
        //-------------//  purge abfragen  //----------------           
        if (message_size_delete>max_message_size && purge_size == false){purge_size = true            
            return bot_MessChannel.send(carefully(purge_size_max_message))
            // verhindert ein error sollte bulkdelete über 100 liegen.
        }else if(message_size_delete<10 && purge_size == false){ purge_size = true
            return bot_MessChannel.send(carefully(purge_size_min_message))
            // sollte delete unter 10 liegen return.
        }else if (purge_size == true){        
            return purge_size = false
            /*  sollte eines von beiden zutreffen und purge_size wurde schon true gesetzt, 
                dann geh auf false um die abfrage von vorne zu starten. */              
        //-----------------------------        
        }else{    
            //-----------  messages starten mit prefix ?? ------------------            
            if(!message.content.startsWith(prefix)){
                if(message.channel == bot_MessChannel){return autodelete_function(message,bot_MessChannel)}else{return}                
                // message beginnt mit prefix dann / wenn nicht return und delete all gesendeten messages.
            }else{
                bmc.run(message,bot) // sende bot_must_check die message und bot informationen erst wenn prefix benutzt wird
                if(message.channel == bot_MessChannel){autodelete_function(message,bot_MessChannel)}
                // sollten zu viele messages im chat stehen wie in der setting angegeben dann mach autodelete
                if (bmc.write_bot_MessChannel()){ // ist botchannel ?? - ja/nein                     
                }else{         
                    //-----------------------------  
                    if (message.content.startsWith(prefix+set_volume)){VolumeNr = message.content.replace(/^[^0-9]+/,'') }
                    // gib mir die zahl des befehls aus
                    //-----------------------------
                    if(!cmd){ // ist cmd nicht dann                 
                        return bot_MessChannel.send(wrap("invalid command")) // wenn der command nach dem prefix falsch geschrieben wurde 
                    }else{ // ist cmd ja dann 
                        setTimeout(function(){return cmd.run(bot,message,VolumeNr)}, 250)                
                    }
                }
            }
        }
    }    
})
//------------------------------
function autodelete_function(message,bot_MessChannel) {    
    
    message.channel.fetchMessages({ limit: 100 }).then(messages => {             

        var lastdate = new Date();
        lastdate.setDate(lastdate.getDate()-12); // date for 12 days
        // console.log(lastdate.getDate(),lastdate.getMonth()+1,lastdate.getFullYear())
        
        msz = messages.size
        // console.log(msz)

        let lastmessage = message.channel.messages.map(msg=>msg.channel.messages.last())
        let ldate = lastmessage.map(msg=>msg.channel.messages.last().createdAt)
        let creatlastmessage = ldate[0].getDate()        
        // console.log("-> the last message or message 100, of the channel is:",lastmessage[0].content,"\n","-> writen on day:",creatlastmessage,".",ldate[0].getMonth()+1,".",ldate[0].getFullYear(),"\n","-> the message channel size is:",msz)
        // console.log("---------------------------")
        let firstmessage = message.channel.messages.map(msg=>msg.channel.messages.first())
        var aktullemessagetdate = message.channel.messages.map(messages=>messages.channel.lastMessage.createdAt)
        var amd = aktullemessagetdate[0].getDate()
        // console.log("-> the first message in the channel is:",firstmessage[0].content,"\n","-> the current message writen on day:",amd-7,".",aktullemessagetdate[0].getMonth()+1,".",aktullemessagetdate[0].getFullYear(),"\n","-> the message channel size is:",msz)

        if(amd==lastdate.getDate()){
            setTimeout(function () { 
                // console.log("-------------amd--------------")
                inst = bot.commands.get("install")
                return inst.run(bot,message)                
            }, 1000)                     
        }//installiert den channel nach 13 tagen wieder neu.... versuch!!
        if(msz > max_message_size && autodelete==false){
            setTimeout(function () { 
                // console.log("-------------msz--------------")
                inst = bot.commands.get("install")
                return inst.run(bot,message)               
            }, 1000)                     
        }//installiert den channel neu wenn die maximale messages.size erreicht wurde
        if(messages.size == message_size_delete-1){
            // console.log("-------------size--------------")
            let purge = bot.commands.get(set_purge)
            return purge.run(bot,message)
        }// löscht die letzten messages die vorgegeben wird in der bot setting
    }), err =>{if (err){throw err,console.log(err)}}
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
//auto volume control versuch
bot.on("guildMemberSpeaking",async function(member,speaking){ 
    
/*     // await member.await(val => val.channel.guild.id,{time: 2500,}) 
    //-----------------------------
    const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == messagesave.guild.id); //constant voiceConnection
    //-----------------------------   
    var VolumeNrmath = VolumeNr
    var timerknock
    // console.log("hallo") 
    if(member.user.bot){
        console.log("bot")        
    }
    if(!member.user.bot){
        if(speaking){  
            console.log("---------------------------  "+speaking)
            console.log("speaking"+ member.user)
            clearTimeout(timerknock)
            console.log("---------------------------  "+timerknock)

            setTimeout(function(){
                console.log(VolumeNrmath/1.2)
                mpm.volume(VolumeNrmath/1.2,voiceConnection) //funktion Volume   
            }, 100)
            setTimeout(function(){
                console.log(VolumeNrmath/1.4)
                mpm.volume(VolumeNrmath/1.4,voiceConnection) //funktion Volume   
            }, 200)
            setTimeout(function(){
                console.log(VolumeNrmath/1.6)
                mpm.volume(VolumeNrmath/1.6,voiceConnection) //funktion Volume   
            }, 300) 
            setTimeout(function(){
                console.log(VolumeNrmath/1.8)
                mpm.volume(VolumeNrmath/1.8,voiceConnection) //funktion Volume   
            }, 400) 
            setTimeout(function(){
                console.log(VolumeNrmath/2)
                mpm.volume(VolumeNrmath/2,voiceConnection) //funktion Volume   
            }, 500)   
            setTimeout(function(){
                console.log(VolumeNrmath/2.2)
                mpm.volume(VolumeNrmath/2.2,voiceConnection) //funktion Volume   
            }, 600) 
            setTimeout(function(){
                console.log(VolumeNrmath/2.4)
                mpm.volume(VolumeNrmath/2.4,voiceConnection) //funktion Volume   
            }, 700) 
        }else{
            console.log("---------------------------  "+speaking)
            console.log("speaking"+ member.user)
            mpm.volume(VolumeNrmath/2.4,voiceConnection) //funktion Volume  
            setTimeout(function(){
                console.log(VolumeNrmath/2.2)
                mpm.volume(VolumeNrmath/2.2,voiceConnection) //funktion Volume   
            }, 100)
            setTimeout(function(){
                console.log(VolumeNrmath/2)
                mpm.volume(VolumeNrmath/2,voiceConnection) //funktion Volume   
            }, 200)  
            setTimeout(function(){
                console.log(VolumeNrmath/1.8)
                mpm.volume(VolumeNrmath/1.8,voiceConnection) //funktion Volume   
            }, 300) 
            setTimeout(function(){
                console.log(VolumeNrmath/1.6)
                mpm.volume(VolumeNrmath/1.6,voiceConnection) //funktion Volume   
            }, 400) 
            setTimeout(function(){
                console.log(VolumeNrmath/1.4)
                mpm.volume(VolumeNrmath/1.4,voiceConnection) //funktion Volume   
            }, 500)
            setTimeout(function(){
                console.log(VolumeNrmath/1.2)
                mpm.volume(VolumeNrmath/1.2,voiceConnection) //funktion Volume   
            }, 600)
            setTimeout(function(){
                console.log(VolumeNr)
                mpm.volume(VolumeNr,voiceConnection) //funktion Volume  
            }, 700) 
        }
    }*/
})
//------------------------------
bot.once('guildMemberAdd', member => {
    console.log(member.user.username)
})
//------------------------------
bot.login(token) // bot token
//------------------------------