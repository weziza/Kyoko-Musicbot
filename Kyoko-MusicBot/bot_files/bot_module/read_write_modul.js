const fs = require('fs')
var content_array=[]

/**
* function json_read // read a JSON file
* @param path A path to a JSON file.
* @param content_array // JSON array of a JSON file content
*/
exports.json_read = function(file_path,content_array){    
    x = fs.readFileSync(file_path)
    content_array = JSON.parse(x)
    return content_array
}

/**
* function json_read // read a JSON file
* @param path A path to a JSON file.
* @param content // JSON content
*/
exports.json_write = function(file_path,content){
    fs.writeFile(file_path,JSON.stringify(content, null, 4), err =>{if (err){throw err}})
}