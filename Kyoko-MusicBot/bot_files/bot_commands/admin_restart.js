const fs = require('fs')
//------------------------------
const restart = ["server restarting!"]
//------------------------------
const setting = require('../bot_setting/bot_setting.json')
var token = setting.token
var admin_id = setting.admin_id
var prefix = setting.prefix
var language = setting.language
//-----------------------------
const lg = require('../language/language - '+language+'.json')
var admin_message = lg.admin_message
//-----------------------------
exports.run = async (bot,message)=>{

    voiceCon = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id)

    if (message.author.id==admin_id) { 

        fs.writeFile("./temp/server_temp.json",JSON.stringify(restart, null, 4), err =>
        // write a json file to resatet automatically the nodemon process 
        {   
            if (err){
                fs.writeFile("./temp/restarting_error.txt", err, function(err){
                    console.log("server restarting!")
                    throw err
                })
            }
        })

        if (voiceCon==null){
            return
        }else{
            voiceCon.disconnect()
            // if bot in voice connetion then disconnect 
            return
        }   
        
    }else{
        message.author.send("```"+admin_message+"```")
    }  
}

exports.help = {
    name: "restart"
}