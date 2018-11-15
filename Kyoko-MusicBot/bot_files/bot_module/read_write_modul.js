const fs = require('fs')
var content_array=[]

/**
* function json_read // read a JSON file
* @param file_path A path to a JSON file.
* @param content_array // JSON array of a JSON file content
*/
exports.json_read = function(file_path,content_array){      
    x = fs.readFileSync(file_path), err =>{if (err){throw err}}
    content_array = JSON.parse(x)        
    return content_array    
}

/**
* function json_read // read a JSON file
* @param file_path A path to a JSON file.
* @param content_array // JSON content
*/
exports.json_write = function(file_path,content_array){
    fs.writeFileSync(file_path,JSON.stringify(content_array, null, 4), err =>{if (err){throw err}})
}